import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from '../dashboard/Sidebar'

function ChangePassword({ token, role, handleLogout }) {
	const [currentPassword, setCurrentPassword] = useState('') // Pole na obecne hasło
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [position, setPosition] = useState('')

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await axios.get('https://planopia.pl/api/users/profile', {
					headers: { Authorization: `Bearer ${token}` },
				})
				setPosition(response.data.position || '') // Ustawienie obecnego stanowiska
			} catch (error) {
				console.error('Błąd podczas pobierania danych użytkownika:', error)
			}
		}
		fetchUserData()
	}, [token])

	const handleSubmit = async e => {
		e.preventDefault()
		if (newPassword !== confirmPassword) {
			alert('Hasła nie są identyczne')
			return
		}

		try {
			await axios.post(
				'https://planopia.pl/api/users/change-password',
				{
					currentPassword, // Przekazujemy obecne hasło do backendu
					newPassword,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
			alert('Hasło zostało zmienione')
		} catch (error) {
			alert('Nie udało się zmienić hasła')
			console.error(error)
		}
	}

	const handlePositionUpdate = async () => {
		try {
			await axios.put(
				'https://planopia.pl/api/users/update-position',
				{ position },
				{ headers: { Authorization: `Bearer ${token}` } }
			)
			alert('Stanowisko zostało zaktualizowane')
		} catch (error) {
			alert('Nie udało się zaktualizować stanowiska')
			console.error(error)
		}
	}

	return (
		<>
			<Sidebar handleLogout={handleLogout} role={role} username={localStorage.getItem('username') || sessionStorage.getItem('username')} />
			<div className='container my-5'>
				<div className='row justify-content-start'>
					<div className='col-md-8'>
						<div>
							<div className='card-body'>
								<h4>Edytuj profil</h4>
								<hr />
								<form
									onSubmit={e => {
										e.preventDefault()
										handlePositionUpdate()
									}}>
									<div className='mb-3'>
										<label htmlFor='position' className='form-label'>
											Stanowisko
										</label>
										<input
											type='text'
											className='form-control'
											id='position'
											value={position}
											onChange={e => setPosition(e.target.value)}
											placeholder='Wpisz swoje stanowisko'
										/>
									</div>
									<button type='submit' className='btn btn-primary mb-3'>
										Zaktualizuj stanowisko
									</button>
								</form>

								<div className='mb-3'>
									<label className='form-label'>Rola</label>
									<input type='text' className='form-control' value={role} readOnly />
								</div>

								<form onSubmit={handleSubmit} style={{ paddingTop: '40px' }}>
									<h4>Zmiana hasła</h4>
									<hr />
									<div className='mb-3'>
										<label htmlFor='currentPassword' className='form-label'>
											Obecne hasło
										</label>
										<input
											type='password'
											className='form-control'
											id='currentPassword'
											value={currentPassword}
											onChange={e => setCurrentPassword(e.target.value)}
											required
											placeholder='Wpisz obecne hasło'
										/>
									</div>
									<div className='mb-3'>
										<label htmlFor='newPassword' className='form-label'>
											Nowe hasło
										</label>
										<input
											type='password'
											className='form-control'
											id='newPassword'
											value={newPassword}
											onChange={e => setNewPassword(e.target.value)}
											required
											placeholder='Wpisz nowe hasło'
										/>
									</div>
									<div className='mb-3'>
										<label htmlFor='confirmPassword' className='form-label'>
											Potwierdź nowe hasło
										</label>
										<input
											type='password'
											className='form-control'
											id='confirmPassword'
											value={confirmPassword}
											onChange={e => setConfirmPassword(e.target.value)}
											required
											placeholder='Potwierdź nowe hasło'
										/>
									</div>
									<button type='submit' className='btn btn-success mb-3'>
										Zmień hasło
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default ChangePassword
