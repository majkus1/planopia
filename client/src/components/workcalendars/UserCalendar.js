import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import Sidebar from '../dashboard/Sidebar'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

function UserCalendar({ token, role, handleLogout }) {
	const { userId } = useParams()
	const [user, setUser] = useState(null)
	const [workdays, setWorkdays] = useState([])
	const [totalHours, setTotalHours] = useState(0)
	const [totalLeaveDays, setTotalLeaveDays] = useState(0)
	const [totalLeaveHours, setTotalLeaveHours] = useState(0)
	const [totalWorkDays, setTotalWorkDays] = useState(0)
	const [totalOtherAbsences, setTotalOtherAbsences] = useState(0)
	const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
	const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
	const [isConfirmed, setIsConfirmed] = useState(false)
	const pdfRef = useRef()
	const calendarRef = useRef(null)

	useEffect(() => {
		fetchUserDetails()
		fetchUserWorkdays()
	}, [userId])

	useEffect(() => {
		calculateTotals(workdays, currentMonth, currentYear)
	}, [workdays, currentMonth, currentYear])

	useEffect(() => {
		checkConfirmationStatus()
	}, [currentMonth, currentYear, userId])

	const fetchUserDetails = async () => {
		try {
			const response = await axios.get(`https://planopia.pl/api/users/${userId}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			console.log('Fetched user details:', response.data) // Debugowanie
			setUser(response.data)
		} catch (error) {
			console.error('Failed to fetch user details:', error)
		}
	}

	const fetchUserWorkdays = async () => {
		try {
			const response = await axios.get(`https://planopia.pl/api/users/workdays/${userId}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			console.log('Fetched workdays:', response.data) // Debugowanie
			setWorkdays(response.data)
		} catch (error) {
			console.error('Failed to fetch workdays:', error)
		}
	}

	const checkConfirmationStatus = async () => {
		try {
			const response = await axios.get(`https://planopia.pl/api/users/workdays/confirmation-status/${userId}`, {
				params: { month: currentMonth, year: currentYear },
				headers: { Authorization: `Bearer ${token}` },
			})
			setIsConfirmed(response.data.isConfirmed || false)
		} catch (error) {
			console.error('Failed to check confirmation status:', error)
		}
	}

	useEffect(() => {
		checkConfirmationStatus()
	}, [currentMonth, currentYear, userId])

	const calculateTotals = (workdays, month, year) => {
		let hours = 0
		let leaveDays = 0
		let workDaysSet = new Set()
		let otherAbsences = 0

		const filteredWorkdays = workdays.filter(day => {
			const eventDate = new Date(day.date)
			return eventDate.getMonth() === month && eventDate.getFullYear() === year
		})

		filteredWorkdays.forEach(day => {
			if (day.hoursWorked) {
				hours += day.hoursWorked
				workDaysSet.add(new Date(day.date).toDateString())
			}
			if (day.absenceType) {
				if (day.absenceType.toLowerCase().includes('urlop')) {
					leaveDays += 1
				} else {
					otherAbsences += 1
				}
			}
		})

		setTotalHours(hours)
		setTotalWorkDays(workDaysSet.size)
		setTotalLeaveDays(leaveDays)
		setTotalLeaveHours(leaveDays * 8)
		setTotalOtherAbsences(otherAbsences)
	}

	const handleMonthChange = info => {
		const newMonth = info.view.currentStart.getMonth()
		const newYear = info.view.currentStart.getFullYear()
		setCurrentMonth(newMonth)
		setCurrentYear(newYear)
	}

	const handleMonthSelect = event => {
		const newMonth = parseInt(event.target.value, 10)
		setCurrentMonth(newMonth)
		goToSelectedDate(newMonth, currentYear)
	}

	const handleYearSelect = event => {
		const newYear = parseInt(event.target.value, 10)
		setCurrentYear(newYear)
		goToSelectedDate(currentMonth, newYear)
	}

	const goToSelectedDate = (month, year) => {
		const calendarApi = calendarRef.current.getApi()
		calendarApi.gotoDate(new Date(year, month, 1))
	}

	const generatePDF = () => {
		const input = pdfRef.current
		html2canvas(input, { scale: 2 }).then(canvas => {
			const imgData = canvas.toDataURL('image/png')
			const pdf = new jsPDF('p', 'mm', 'a4')
			const imgProps = pdf.getImageProperties(imgData)
			const pdfWidth = pdf.internal.pageSize.getWidth()
			const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

			pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
			pdf.save(`czas_pracy_${user?.firstName}_${user?.lastName}_${currentMonth + 1}_${currentYear}.pdf`)
		})
	}

	return (
		<>
    <Sidebar handleLogout={handleLogout} role={role} username={localStorage.getItem('username') || sessionStorage.getItem('username')} />
			<div id='calendars-works-review'>
				<button onClick={generatePDF} className='btn-pdf btn btn-primary'>
					Generuj PDF
				</button>
        <label style={{ marginLeft: "5px" }}>
							Miesiąc:
							<select value={currentMonth} onChange={handleMonthSelect} style={{ marginRight: "5px", marginLeft: "5px" }}>
								{Array.from({ length: 12 }, (_, i) => (
									<option key={i} value={i}>
										{new Date(0, i).toLocaleString('pl', { month: 'long' })}
									</option>
								))}
							</select>
						</label>
						<label>
							Rok:
							<select value={currentYear} onChange={handleYearSelect} style={{ marginLeft: "5px" }}>
								{Array.from({ length: 20 }, (_, i) => {
									const year = new Date().getFullYear() - 10 + i
									return (
										<option key={year} value={year}>
											{year}
										</option>
									)
								})}
							</select>
						</label>
				<div ref={pdfRef} style={{ marginTop: "30px", padding: "10px" }}>
					{user && <h3>Czas pracy: <span style={{ fontWeight: "bold" }}>{user.firstName} {user.lastName} ({user.position})</span></h3>}

					<div className='calendar-controls' style={{ marginTop: "15px" }}>
						
						<label>
							<input
								type='checkbox'
								checked={isConfirmed}
								readOnly
                style={{ marginRight: "5px" }}
								// Aktualizujemy wyświetlanie w zależności od `isConfirmed`
							/>
							{isConfirmed ? 'Potwierdzony kalendarz' : 'Niepotwierdzony kalendarz'}
						</label>
					</div>

					<div className='row'>
						<div className='col-xl-9'>
							<FullCalendar
								plugins={[dayGridPlugin, interactionPlugin]}
								initialView='dayGridMonth'
								locale='pl'
								firstDay={1}
								showNonCurrentDates={false}
								events={workdays.map(day => ({
									title: day.hoursWorked ? `${day.hoursWorked} godz.` : day.absenceType,
									start: day.date,
									backgroundColor: day.hoursWorked ? 'blue' : 'green',
									textColor: 'white',
									id: day._id,
									classNames: day.hoursWorked ? 'event-workday' : 'event-absence',
									extendedProps: {
										isWorkday: !!day.hoursWorked,
									},
								}))}
								ref={calendarRef}
								displayEventTime={false}
								datesSet={handleMonthChange}
								height="auto"
							/>
						</div>
						<div className='col-xl-3 resume-month'>
							<h3 style={{ fontWeight: "normal" }}>Podsumowanie dla wybranego miesiąca:</h3>
							<p>Dni w pracy: {totalWorkDays}</p>
							<p>Łączna liczba godzin pracy: {totalHours}</p>
							<p>
								Łączna liczba dni urlopu: {totalLeaveDays} ({totalLeaveHours} godz.)
							</p>
							<p>Inne nieobecności: {totalOtherAbsences}</p>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default UserCalendar
