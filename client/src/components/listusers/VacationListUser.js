import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../dashboard/Sidebar'
import { Link } from 'react-router-dom'

function VacationListUser({ token, role, handleLogout }) {
	const [users, setUsers] = useState([])
	const [error, setError] = useState('')
	const navigate = useNavigate()

	useEffect(() => {
		fetchUsers()
	}, [])

	const fetchUsers = async () => {
		try {
			const response = await axios.get('https://planopia.pl/api/users/all-users', {
				headers: { Authorization: `Bearer ${token}` },
			})
			setUsers(response.data)
		} catch (error) {
			console.error('Failed to fetch users:', error)
			setError('Nie udało się pobrać listy użytkowników. Spróbuj zalogować się ponownie.')
		}
	}

	const handleUserClick = userId => {
		navigate(`/leave-requests/${userId}`)
	}

	return (
		<>
			<Sidebar handleLogout={handleLogout} role={role} username={localStorage.getItem('username') || sessionStorage.getItem('username')} />

			<div id='list-employee'>
				<h3>Urlopy/nieobecności pracowników</h3>
				<hr />
				<Link to='/all-leave-plans' className='btn btn-primary mb-3'>
					Plany urlopowe wszystkich
				</Link>
				{error && <p style={{ color: 'red' }}>{error}</p>} 
				<h3 style={{ marginTop: "35px" }}>Zgłoszenia</h3>
				<p>Lista Pracowników:</p>
				<ul>
					{users.map(user => (
						<li key={user._id} onClick={() => handleUserClick(user._id)} style={{ cursor: 'pointer' }}>
							{user.firstName} {user.lastName} - {user.roles.join(', ')} - {user.position || 'Brak stanowiska'}
						</li>
					))}
				</ul>
			</div>
		</>
	)
}

export default VacationListUser
