import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Sidebar from '../dashboard/Sidebar'
import { useParams, useNavigate } from 'react-router-dom'

function AdminLeaveRequests({ token, role, handleLogout }) {
	const { userId } = useParams()
	const [user, setUser] = useState(null)
	const [leaveRequests, setLeaveRequests] = useState([])
	const [vacationDays, setVacationDays] = useState(null) // Początkowa wartość na `null`
	const [loadingVacationDays, setLoadingVacationDays] = useState(true) // Dodane, aby obsłużyć stan ładowania
	const navigate = useNavigate()

	useEffect(() => {
		console.log('Fetched userId:', userId) // Sprawdź, co jest w `userId`
		fetchLeaveRequests()
		fetchVacationDays()
		fetchUserDetails()
	}, [userId])

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

	const fetchLeaveRequests = async () => {
		try {
			const response = await axios.get(`https://planopia.pl/api/users/leave-requests/${userId}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			console.log(response.data) // Sprawdź dane, czy `updatedBy` jest poprawnie wypełnione
			const sortedRequests = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
			setLeaveRequests(sortedRequests)
		} catch (error) {
			console.error('Błąd podczas pobierania zgłoszeń:', error)
		}
	}

	const fetchVacationDays = async () => {
		try {
			const response = await axios.get(`https://planopia.pl/api/users/${userId}/vacation-days`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			setVacationDays(response.data.vacationDays) // Pobranie liczby dni urlopu
		} catch (error) {
			console.error('Błąd podczas pobierania liczby dni urlopu:', error)
		} finally {
			setLoadingVacationDays(false) // Zakończono ładowanie
		}
	}

	const updateVacationDays = async () => {
		try {
			await axios.patch(
				`https://planopia.pl/api/users/${userId}/vacation-days`,
				{ vacationDays },
				{ headers: { Authorization: `Bearer ${token}` } }
			)
			alert('Liczba dni urlopu zaktualizowana pomyślnie')
			fetchVacationDays() // Aktualizacja danych po udanej operacji
		} catch (error) {
			console.error('Błąd podczas aktualizacji liczby dni urlopu:', error)
		}
	}

	const updateLeaveRequestStatus = async (id, newStatus) => {
		try {
			// Aktualizuj status wniosku
			await axios.patch(
				`https://planopia.pl/api/users/leave-requests/${id}`,
				{ status: newStatus },
				{ headers: { Authorization: `Bearer ${token}` } }
			)

			// Odświeżanie listy zgłoszeń
			fetchLeaveRequests()
		} catch (error) {
			console.error('Błąd podczas aktualizacji statusu zgłoszenia:', error)
		}
	}

	const formatDate = date => {
		const options = { day: '2-digit', month: 'long', year: 'numeric' }
		return new Date(date).toLocaleDateString('pl-PL', options)
	}

	const goToPDFPreview = leaveRequest => {
		navigate('/leave-request-pdf-preview', { state: { leaveRequest } })
	}

	return (
		<>
			<Sidebar handleLogout={handleLogout} role={role} username={localStorage.getItem('username') || sessionStorage.getItem('username')} />

			<div id='leave-requests-review'>
				<h3>Zgłoszenia urlopów/nieobecności</h3>
				<hr />
				{user && (
					<h3 style={{ marginBottom: '25px' }}>
						{user.firstName} {user.lastName} ({user.position})
					</h3>
				)}
				<div>
					<label style={{ marginRight: '5px' }}>Liczba dni urlopu:</label>
					{loadingVacationDays ? ( // Wyświetl komunikat "Ładowanie" podczas pobierania danych
						<p>Ładowanie...</p>
					) : (
						<>
							<input
								type='number'
								value={vacationDays !== null ? vacationDays : ''} // Pozwala na pustą wartość
								onChange={e => {
									const value = e.target.value
									// Pozwalamy na pusty ciąg znaków lub liczbę
									if (value === '') {
										setVacationDays(null)
									} else {
										setVacationDays(Number(value))
									}
								}}
								style={{ width: '60px' }}
							/>
							<button onClick={updateVacationDays} style={{ marginLeft: '5px' }} className='btn btn-primary'>
								Zaktualizuj
							</button>
						</>
					)}
				</div>

				<ul style={{ marginTop: '20px' }}>
					<h4 style={{ marginBottom: '20px' }}>Wnioski:</h4>
					{leaveRequests.map(request => (
						<li key={request._id} style={{ marginBottom: '30px' }}>
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

							<button
								onClick={() => updateLeaveRequestStatus(request._id, 'Zaakceptowano')}
								style={{ marginRight: '5px' }}
								className='btn btn-success'>
								Zaakceptuj
							</button>
							<button
								onClick={() => updateLeaveRequestStatus(request._id, 'Odrzucono')}
								style={{ marginRight: '5px' }}
								className='btn btn-danger'>
								Odrzuć
							</button>

							<button
								onClick={() => goToPDFPreview(request)}
								style={{ marginRight: '5px' }}
								className='btn btn-primary'>
								Podgląd PDF
							</button>
						</li>
					))}
				</ul>
			</div>
		</>
	)
}

export default AdminLeaveRequests
