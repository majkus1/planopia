import React, { useState, useEffect, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import axios from 'axios'
import Modal from 'react-modal'

Modal.setAppElement('#root')

function MonthlyCalendar({ token }) {
	const [workdays, setWorkdays] = useState([])
	const [modalIsOpen, setModalIsOpen] = useState(false)
	const [selectedDate, setSelectedDate] = useState(null)
	const [hoursWorked, setHoursWorked] = useState('')
	const [absenceType, setAbsenceType] = useState('')
	const [totalHours, setTotalHours] = useState(0)
	const [totalLeaveDays, setTotalLeaveDays] = useState(0)
	const [totalLeaveHours, setTotalLeaveHours] = useState(0)
	const [totalWorkDays, setTotalWorkDays] = useState(0)
	const [totalOtherAbsences, setTotalOtherAbsences] = useState(0)
	const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
	const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
	const [isConfirmed, setIsConfirmed] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const calendarRef = useRef(null)

	useEffect(() => {
		fetchWorkdays()
		checkConfirmationStatus()
	}, [token, currentMonth, currentYear])

	useEffect(() => {
		calculateTotals(workdays, currentMonth, currentYear)
	}, [workdays, currentMonth, currentYear])

	const fetchWorkdays = async () => {
		try {
			const response = await axios.get('https://planopia.pl/api/users/workdays', {
				headers: { Authorization: `Bearer ${token}` },
			})
			setWorkdays(response.data)
		} catch (error) {
			console.error('Failed to fetch workdays:', error)
		}
	}

	const checkConfirmationStatus = async () => {
		try {
			const response = await axios.get(`https://planopia.pl/api/users/workdays/confirmation-status`, {
				params: {
					month: currentMonth,
					year: currentYear,
				},
				headers: { Authorization: `Bearer ${token}` },
			})
			setIsConfirmed(response.data.isConfirmed || false) // Ustawienie wartości domyślnej na false, jeśli brak danych
		} catch (error) {
			console.error('Failed to check confirmation status:', error)
		}
	}

	const toggleConfirmationStatus = async () => {
		try {
			await axios.post(
				`https://planopia.pl/api/users/workdays/confirm`,
				{ month: currentMonth, year: currentYear, isConfirmed: !isConfirmed },
				{ headers: { Authorization: `Bearer ${token}` } }
			)
			setIsConfirmed(!isConfirmed) // Aktualizacja stanu po pomyślnym zapisie
		} catch (error) {
			console.error('Failed to toggle confirmation status:', error)
		}
	}

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

	const handleDateClick = info => {
		const eventsOnDate = workdays.filter(
			day => new Date(day.date).toDateString() === new Date(info.dateStr).toDateString()
		)

		if (eventsOnDate.length >= 2) {
			alert('Dozwolone są tylko dwa wydarzenia dziennie.')
			return
		}

		setSelectedDate(info.dateStr)
		setModalIsOpen(true)
	}

	const handleMonthChange = info => {
		const newMonth = info.view.currentStart.getMonth()
		const newYear = info.view.currentStart.getFullYear()
		setCurrentMonth(newMonth)
		setCurrentYear(newYear)
		calculateTotals(workdays, newMonth, newYear)
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

	const handleSubmit = async e => {
		e.preventDefault()

		// Sprawdzanie, czy oba pola są wypełnione
		if (hoursWorked && absenceType) {
			setErrorMessage('Wypełnij tylko jedno pole: liczba godzin pracy lub typ nieobecności')
			return
		}

		// Sprawdzanie, czy żadne pole nie jest wypełnione
		if (!hoursWorked && !absenceType) {
			setErrorMessage('Wypełnij co najmniej jedno pole')
			return
		}

		const data = {
			date: selectedDate,
			hoursWorked: hoursWorked ? parseInt(hoursWorked) : null,
			absenceType: absenceType || null,
		}

		try {
			await axios.post('https://planopia.pl/api/users/workdays', data, {
				headers: { Authorization: `Bearer ${token}` },
			})
			setModalIsOpen(false)
			setHoursWorked('')
			setAbsenceType('')
			setErrorMessage('')
			fetchWorkdays()
		} catch (error) {
			console.error('Failed to add workday:', error)
		}
	}

	const handleDelete = async id => {
		try {
			await axios.delete(`https://planopia.pl/api/users/workdays/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			fetchWorkdays()
		} catch (error) {
			console.error('Failed to delete workday:', error)
		}
	}

	const renderEventContent = eventInfo => {
		return (
			<div className={`event-content ${eventInfo.event.extendedProps.isWorkday ? 'event-workday' : 'event-absence'}`}>
				<span>{eventInfo.event.title}</span>
				<span className='event-delete' onClick={() => handleDelete(eventInfo.event.id)}>
					×
				</span>
			</div>
		)
	}

	return (
		<div className='row'>
			<div className='col-xl-9'>
				<h3>Twoja ewidencja czasu pracy</h3>
				<hr />
				<p style={{ marginBottom: "0px" }}>Po uzupełnieniu miesiąca potwierdź kalendarz:</p>
				<label style={{ marginLeft: '10px', marginBottom: '20px', marginTop: '15px', marginBottom: '35px' }}>
				<img
							src='/img/arrow-right.png'
							alt=''
							style={{ width: "40px", marginRight: "10px", marginTop: "-10px" }}
						/>
					<input
						type='checkbox'
						checked={isConfirmed}
						onChange={() => {
							toggleConfirmationStatus()
							alert(isConfirmed ? 'Anulowałeś potwierdzenie kalendarza' : 'Pomyślnie potwierdzono kalendarz')
						}}
						style={{ marginRight: '10px', transform: 'scale(2)', cursor: 'pointer' }}
					/>
					{isConfirmed ? 'Potwierdzony kalendarz' : 'Niepotwierdzony kalendarz'}
				</label>

				<div className='calendar-controls'>
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
					dateClick={handleDateClick}
					eventContent={renderEventContent}
					displayEventTime={false}
					datesSet={handleMonthChange}
					height='auto'
				/>
			</div>
			<div className='col-xl-3 resume-month-work'>
				<h3 className='resumecales'>Podsumowanie dla wybranego miesiąca:</h3>
				<p>Dni w pracy: {totalWorkDays}</p>
				<p>Łączna liczba godzin pracy: {totalHours} godz.</p>
				<p>
					Łączna liczba dni urlopu: {totalLeaveDays} ({totalLeaveHours} godz.)
				</p>
				<p>Inne nieobecności: {totalOtherAbsences}</p>
			</div>

			<Modal
  isOpen={modalIsOpen}
  onRequestClose={() => {
    setModalIsOpen(false)
    setErrorMessage('') // Wyczyść błąd przy zamknięciu modalu
  }}
  style={{
    overlay: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Opcjonalnie, przyciemnij tło
    },
    content: {
      position: 'relative',
      inset: 'unset', // Usuwa domyślne marginesy
      margin: '0',
      maxWidth: '500px', // Maksymalna szerokość modala
      width: '90%', // Opcjonalnie, responsywna szerokość
      borderRadius: '10px', // Zaokrąglone rogi
      padding: '40px',
    },
  }}
  contentLabel="Dodaj godziny pracy lub nieobecność"
>
  <h2 style={{ marginBottom: '0px', marginLeft: "5px" }}>Dodaj godziny pracy lub nieobecność</h2>
  <form onSubmit={handleSubmit} style={{ marginTop: '30px' }}>
    <label>
      
      <input
        type="number"
        min="1"
		placeholder='Liczba godzin pracy'
        max="24"
        value={hoursWorked}
        onChange={(e) => setHoursWorked(e.target.value)}
        style={{ minWidth: '180px', marginBottom: '20px', marginLeft: '5px' }}
      />
    </label>
    <br />
    <label>
      
      <input
        type="text"
		placeholder='Typ nieobecności'
        value={absenceType}
        onChange={(e) => setAbsenceType(e.target.value)}
        style={{ maxWidth: '260px', marginBottom: '20px', marginLeft: '5px' }}
      />
    </label>
    <br />
    {errorMessage && (
      <div style={{ color: 'red', marginBottom: '20px', maxWidth: "350px" }}>{errorMessage}</div>
    )}
    <button type="submit" className="btn btn-primary" style={{ marginRight: '10px' }}>
      Zapisz
    </button>
    <button
      type="button"
      onClick={() => {
        setModalIsOpen(false)
        setErrorMessage('') // Wyczyść błąd przy kliknięciu "Anuluj"
      }}
      className="btn btn-danger"
    >
      Anuluj
    </button>
  </form>
</Modal>

		</div>
	)
}

export default MonthlyCalendar
