import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Sidebar({ role, handleLogout, username }) {
	const [isMenuOpen, setIsMenuOpen] = useState(window.innerWidth > 1999)
	const navigate = useNavigate()

	const checkToken = () => {
		const token = localStorage.getItem('token') || sessionStorage.getItem('token')
		if (!token) {
			// Wylogowanie użytkownika
			localStorage.clear()
			sessionStorage.clear()
			navigate('/login')
			window.location.reload()
		}
	}

	useEffect(() => {
		// Sprawdzanie tokena przy każdej zmianie widoku
		checkToken()

		// Sprawdzanie tokena co określony czas (np. co 5 sekund)
		const interval = setInterval(checkToken, 5000)

		return () => clearInterval(interval) // Czyszczenie interwału przy unmount
	}, [])

	useEffect(() => {
		function handleResize() {
			if (window.innerWidth > 1999) {
				setIsMenuOpen(true)
			} else {
				setIsMenuOpen(false)
			}
		}

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	const handleLogoutClick = () => {
		localStorage.clear()
		sessionStorage.clear()
		navigate('/login')
		window.location.reload()
	}

	// Funkcja obsługująca sprawdzanie wielu ról
	const hasRole = (...requiredRoles) => {
		return Array.isArray(role) && requiredRoles.some(requiredRole => role.includes(requiredRole))
	}

	return (
		<>
			<div className='container-fluid p-0'>
				<nav className='navbar navbar-expand-lg d-md-none' style={{ paddingLeft: "15px", paddingRight: "15px" }}>
					<Link to='/' className='navbar-brand'>
						{/* <img
							src='/img/logo.webp'
							alt='Logo'
							className='img-fluid'
							style={{ width: '40px' }}
						/> */}
						<p className='company-txt'>planopia</p>
					</Link>
					<button className='navbar-toggler' type='button' onClick={toggleMenu}>
						<span>MENU</span>
					</button>
				</nav>

				<div className={`sidebar bg-dark text-white ${isMenuOpen ? 'opened' : 'closed'}`} style={{ zIndex: 1050 }}>
					<Link to='/' className='logo-sidebar mt-2 mb-2'>
						{/* <img
							src='/img/logo.webp'
							alt='Logo'
							className='img-fluid'
							style={{ width: '80px', margin: '0 auto', display: 'block' }}
						/> */}
						<p className='company-txt'>planopia</p>
					</Link>

					<button onClick={toggleMenu} className='closesidebar'>
						X
					</button>

					<div className='sidebar-header p-3 d-flex justify-content-between align-items-center'>
						<h5>{username}</h5>
					</div>
					<div className='p-2 btns-pages'>
						<Link to='/change-password' className='btn btn-light btn-sm mb-2 w-100'>
							Edytuj profil
						</Link>
						<Link to='/' className='btn btn-light btn-sm mb-2 w-100'>
							Ewidencja czasu pracy
						</Link>
						<Link to='/leave-request' className='btn btn-light btn-sm mb-2 w-100'>
							Zgłoś urlop/nieobecność
						</Link>
						<div className='admins-links'>
							{hasRole(
								'Admin',
								'Zarząd',
								'Kierownik IT',
								'Kierownik BOK',
								'Kierownik Bukmacher',
								'Kierownik Marketing',
								'Urlopy czas pracy'
							) && (
								<Link to='/calendars-list' className='btn btn-light btn-sm mb-2 w-100'>
									Wszystkie ewidencje czasu pracy
								</Link>
							)}
							{hasRole(
								'Admin',
								'Zarząd',
								'Kierownik IT',
								'Kierownik BOK',
								'Kierownik Bukmacher',
								'Kierownik Marketing',
								'Urlopy czas pracy'
							) && (
								<Link to='/leave-list' className='btn btn-light btn-sm mb-2 w-100'>
									Urlopy/nieobec. pracowników
								</Link>
							)}
						</div>
						<div className='admins-links'>
							{hasRole('Admin') && (
								<Link to='/create-user' className='btn btn-light btn-sm mb-2 w-100'>
									Dodaj nowego użytkownika
								</Link>
							)}
							{hasRole('Admin') && (
								<Link to='/logs' className='btn btn-light btn-sm mb-2 w-100'>
									Użytkownicy i logi
								</Link>
							)}
						</div>
						<br />
						<br />
						<button onClick={handleLogoutClick} className='btn btn-danger btn-sm w-100' style={{ maxWidth: "300px" }}>
							Wyloguj
						</button>
					</div>
				</div>
			</div>
		</>
	)
}

export default Sidebar
