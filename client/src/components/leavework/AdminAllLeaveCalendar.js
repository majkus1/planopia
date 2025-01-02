import React, { useState, useEffect, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import Sidebar from '../dashboard/Sidebar'
import axios from 'axios'

function AdminAllLeaveCalendar({ token, role, handleLogout }) {
	const [leavePlans, setLeavePlans] = useState([])
	const colorsRef = useRef({}) // Kolory dla użytkowników
	const usedColors = useRef(new Set()) // Zbiór użytych kolorów
	const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
	const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
	const calendarRef = useRef(null)

	useEffect(() => {
		fetchAllLeavePlans()
	}, [])

	const fetchAllLeavePlans = async () => {
		try {
			const response = await axios.get('https://planopia.pl/api/users/admin/all-leave-plans', {
				headers: { Authorization: `Bearer ${token}` },
			})
			setLeavePlans(response.data)
		} catch (error) {
			console.error('Error fetching all leave plans:', error)
		}
	}

	// Funkcja generująca losowy kolor
	const generateUniqueColor = () => {
		let color
		do {
			const randomHue = Math.random() * 360
			color = `hsl(${randomHue}, 70%, 80%)`
		} while (usedColors.current.has(color)) // Powtarzaj, jeśli kolor już istnieje
		usedColors.current.add(color) // Dodaj nowy kolor do listy użytych
		return color
	}

	// Funkcja zwracająca kolor dla użytkownika
	const getColorForUser = username => {
		if (!colorsRef.current[username]) {
			colorsRef.current[username] = generateUniqueColor()
		}
		return colorsRef.current[username]
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

	const handleMonthChange = info => {
		const newMonth = info.view.currentStart.getMonth()
		const newYear = info.view.currentStart.getFullYear()
		setCurrentMonth(newMonth)
		setCurrentYear(newYear)
	}

	return (
		<>
			<Sidebar handleLogout={handleLogout} role={role} username={localStorage.getItem('username') || sessionStorage.getItem('username')} />

			<div id='all-leaveplans' style={{ padding: "20px" }}>
				<h3>Plany urlopowe wszystkich pracowników</h3>
				<hr />
				<div className='calendar-controls' style={{ marginTop: "30px" }}>
					<label>
						Miesiąc:
						<select value={currentMonth} onChange={handleMonthSelect} style={{ marginLeft: '5px' }}>
							{Array.from({ length: 12 }, (_, i) => (
								<option key={i} value={i}>
									{new Date(0, i).toLocaleString('pl', { month: 'long' })}
								</option>
							))}
						</select>
					</label>
					<label style={{ marginLeft: '10px' }}>
						Rok:
						<select value={currentYear} onChange={handleYearSelect} style={{ marginLeft: '5px' }}>
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
				</div>
				<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
					<FullCalendar
						plugins={[dayGridPlugin]}
						initialView='dayGridMonth'
						initialDate={new Date()}
						locale='pl'
						height='auto'
						firstDay={1}
						showNonCurrentDates={false}
						events={leavePlans.map(plan => ({
							title: `${plan.firstName} ${plan.lastName}`,
							start: plan.date,
							allDay: true,
							backgroundColor: getColorForUser(plan.username), // Unikalny kolor dla użytkownika
							borderColor: getColorForUser(plan.username),
						}))}
						ref={calendarRef}
						datesSet={handleMonthChange}
					/>
				</div>
			</div>
		</>
	)
}

export default AdminAllLeaveCalendar
