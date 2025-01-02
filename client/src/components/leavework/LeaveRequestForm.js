import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from '../dashboard/Sidebar'
import { Link } from 'react-router-dom'

function LeaveRequestForm({ token, role, handleLogout }) {
	const [type, setType] = useState('Urlop wypoczynkowy')
	const [startDate, setStartDate] = useState('')
	const [endDate, setEndDate] = useState('')
	const [daysRequested, setDaysRequested] = useState(0)
	const [replacement, setReplacement] = useState('')
	const [additionalInfo, setAdditionalInfo] = useState('')
	const [leaveRequests, setLeaveRequests] = useState([])
	const [availableLeaveDays, setAvailableLeaveDays] = useState(0)

	useEffect(() => {
		fetchAvailableLeaveDays()
		fetchLeaveRequests()
	}, [])

	const fetchAvailableLeaveDays = async () => {
		try {
			const response = await axios.get('https://planopia.pl/api/users/vacation-days', {
				headers: { Authorization: `Bearer ${token}` },
			})
			setAvailableLeaveDays(response.data.vacationDays) // Tylko dla zalogowanego użytkownika
		} catch (error) {
			console.error('Błąd podczas pobierania dostępnych dni urlopu:', error)
		}
	}

	const fetchLeaveRequests = async () => {
		try {
			const response = await axios.get('https://planopia.pl/api/users/user-leave-requests', {
				headers: { Authorization: `Bearer ${token}` },
			})
			setLeaveRequests(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
		} catch (error) {
			console.error('Błąd podczas pobierania zgłoszeń:', error)
		}
	}

	// Automatyczne obliczanie liczby dni między startDate i endDate
	useEffect(() => {
		if (startDate && endDate) {
			const start = new Date(startDate)
			const end = new Date(endDate)
			const timeDiff = Math.abs(end - start)
			setDaysRequested(Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1) // Dodajemy +1, aby uwzględnić oba dni
		}
	}, [startDate, endDate])

	const submitLeaveRequest = async e => {
		e.preventDefault()
		try {
			const data = { type, startDate, endDate, daysRequested, replacement, additionalInfo }
			await axios.post('https://planopia.pl/api/users/leave-request', data, {
				headers: { Authorization: `Bearer ${token}` },
			})
			// Wyświetlenie alertu po pomyślnym wysłaniu wniosku
			alert('Wniosek został pomyślnie wysłany!')
	
			// Aktualizacja listy wniosków i reset formularza
			fetchLeaveRequests()
			setType('Urlop wypoczynkowy')
			setStartDate('')
			setEndDate('')
			setDaysRequested(0)
			setReplacement('')
			setAdditionalInfo('')
		} catch (error) {
			console.error('Błąd podczas wysyłania wniosku:', error)
			alert('Wystąpił błąd podczas wysyłania wniosku. Spróbuj ponownie.')
		}
	}
	

	const formatDate = date => {
		const options = { day: '2-digit', month: 'long', year: 'numeric' }
		return new Date(date).toLocaleDateString('pl-PL', options)
	}

	return (
		<>
			<Sidebar handleLogout={handleLogout} role={role} username={localStorage.getItem('username') || sessionStorage.getItem('username')} />
			<div id='leave-request-form'>
				<Link to='/leave-planner' className='btn btn-primary mb-3' style={{ marginRight: '5px' }}>
					Zaplanuj swój urlop
				</Link>
				<Link to='/all-leave-plans' className='btn btn-primary mb-3'>
					Plany urlopowe wszystkich
				</Link>
				<p>
					Dostępne dni urlopu:{' '}
					{availableLeaveDays === 0 ? <span style={{ color: 'red' }}>brak danych</span> : availableLeaveDays}
				</p>

				<h2 style={{ marginTop: '40px' }}>Wniosek o urlop lub nieobecność</h2>
				<hr />
				<form onSubmit={submitLeaveRequest} id='formleave'>
					<div>
						<label>Rodzaj wniosku:</label>
						<select value={type} onChange={e => setType(e.target.value)}>
							<option value='Urlop wypoczynkowy'>Urlop wypoczynkowy</option>
							<option value='Urlop okolicznościowy'>Urlop okolicznościowy</option>
							<option value='Urlop na żądanie'>Urlop na żądanie</option>
							<option value='Urlop bezpłatny'>Urlop bezpłatny</option>
							<option value='Inna nieobecność'>Inna nieobecność</option>
						</select>
					</div>

					<div>
						<label>Data od:</label>
						<input
							type='date'
							value={startDate}
							onChange={e => setStartDate(e.target.value)}
							required
							style={{ marginRight: '3px' }}
						/>
						<label>Data do:</label>
						<input type='date' value={endDate} onChange={e => setEndDate(e.target.value)} required />
					</div>

					<div>
						<label>Wnioskowana liczba dni:</label>
						<input type='number' value={daysRequested} onChange={e => setDaysRequested(e.target.value)} />
					</div>

					<div className='flexcol'>
						<label>Osoba zastępująca:</label>
						<input
							type='text'
							value={replacement}
							onChange={e => setReplacement(e.target.value)}
							placeholder='Opcjonalnie'
						/>
					</div>

					<div style={{ display: 'flex' }} className='flexcol'>
						<label>Informacje dodatkowe:</label>
						<textarea
							value={additionalInfo}
							onChange={e => setAdditionalInfo(e.target.value)}
							placeholder='Opcjonalnie'
						/>
					</div>

					<button type='submit' className='btn btn-success' style={{ marginLeft: "5px" }}>
						Wyślij wniosek
					</button>
				</form>

				<h3>Lista wniosków</h3>
				<ul>
					{leaveRequests.map((request, index) => (
						<li key={index} style={{ marginTop: '25px' }}>
							<p>Rodzaj: {request.type}</p>
							<p>
								Data: {formatDate(request.startDate)} - {formatDate(request.endDate)}
							</p>
							<p>Liczba dni: {request.daysRequested}</p>
							<p>Zastępujący: {request.replacement || 'Brak'}</p>
							<p>Uwagi: {request.additionalInfo || 'Brak'}</p>
							<p>
								Status:{' '}
								<span
    className={`autocol ${
        request.status === 'Zaakceptowano'
            ? 'status-accepted'
            : request.status === 'Oczekuje na akceptacje'
            ? 'status-pending'
            : 'status-rejected'
    }`}
>
    {request.status}
</span>

								{request.updatedBy && (
									<span>
										{' '}
										(przez: {request.updatedBy.firstName} {request.updatedBy.lastName})
									</span>
								)}
							</p>
						</li>
					))}
				</ul>
			</div>
		</>
	)
}

export default LeaveRequestForm
