import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from './Sidebar'
import MonthlyCalendar from '../workcalendars/MonthlyCalendar'

function Dashboard({ role, handleLogout, token }) {
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	return (
		<>
			<Sidebar handleLogout={handleLogout} role={role} username={localStorage.getItem('username') || sessionStorage.getItem('username')} />

			<div className='content p-3'>
				{/* {role === "Admin" && (
          <div className="admin-section rounded p-3 bg-dark">
            <h5>Admin</h5>
            <Link to="/create-user" className="btn btn-light btn-sm mb-2 w-100" style={{ color: '#1f2d3d' }}>
              Stwórz nowego użytkownika
            </Link>
          </div>
        )} */}

				<div className='calendar-section my-4'>
					<MonthlyCalendar token={token} />
					{/* <Link to="/calendar" className="btn btn-primary mt-3">
            Pokaż cały kalendarz
          </Link> */}
				</div>
			</div>
		</>
	)
}

export default Dashboard
