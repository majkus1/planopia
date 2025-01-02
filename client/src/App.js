import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import CreateUser from './components/profile/CreateUser'
import Login from './components/profile/Login'
import Dashboard from './components/dashboard/Dashboard'
import ChangePassword from './components/profile/ChangePassword'
import SetPassword from './components/profile/SetPassword'
import ResetPassword from './components/profile/ResetPassword'
import ProtectedRoute from './components/route/ProtectedRoute'
import Logs from './components/profile/Logs'
import AdminUserList from './components/listusers/AdminUserList'
import UserCalendar from './components/workcalendars/UserCalendar'
import LeaveRequestForm from './components/leavework/LeaveRequestForm'
import AdminLeaveRequests from './components/leavework/AdminLeaveRequests'
import LeaveRequestPDFPreview from './components/leavework/LeaveRequestPDFPreview'
import LeavePlanner from './components/leavework/LeavePlanner'
import EmployeeListPlanner from './components/listusers/EmployeeListPlanner'
import EmployeeLeaveCalendar from './components/leavework/EmployeeLeaveCalendar'
import AdminAllLeaveCalendar from './components/leavework/AdminAllLeaveCalendar'
import VacationListUser from './components/listusers/VacationListUser'
import NewPassword from './components/profile/NewPassword'
import { Helmet } from 'react-helmet-async'
import '../src/style.css'

function App() {
	const [loggedIn, setLoggedIn] = useState(null)
	const [role, setRole] = useState(localStorage.getItem('role') || sessionStorage.getItem('role') || '')
	const [token, setToken] = useState(localStorage.getItem('token') || sessionStorage.getItem('token') || '')

	// useEffect(() => {
	// 	const savedToken = localStorage.getItem('token')
	// 	const savedRoles = JSON.parse(localStorage.getItem('roles') || '[]')

	// 	if (savedToken && savedRoles.length > 0) {
	// 		setLoggedIn(true)
	// 		setToken(savedToken)
	// 		setRole(savedRoles)
	// 	} else {
	// 		setLoggedIn(false)
	// 	}
	// }, [])
	

	useEffect(() => {
		const savedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
		const savedRoles = JSON.parse(localStorage.getItem("roles") || sessionStorage.getItem("roles") || "[]");
	  
		if (savedToken && savedRoles.length > 0) {
		  setLoggedIn(true);
		  setToken(savedToken);
		  setRole(savedRoles);
		} else {
		  setLoggedIn(false);
		}
	  }, []);
	  

	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('roles');
		localStorage.removeItem('username');
		console.log('LocalStorage after logout:', localStorage);
		setLoggedIn(false);
		setRole('');
		setToken('');
	};
	

	return (
		<>
			<Helmet>
				<title>Planopia</title>
			</Helmet>
			<Router>
				<div>
					<Routes>
						<Route path='/login' element={<Login setLoggedIn={setLoggedIn} setRole={setRole} setToken={setToken} />} />
						<Route path='/set-password/:token' element={<SetPassword />} />
						<Route path='/reset-password' element={<ResetPassword />} />
						<Route path='/new-password/:token' element={<NewPassword />} />
						<Route element={<ProtectedRoute isLoggedIn={loggedIn} token={token} handleLogout={handleLogout} />}>
							<Route path='/' element={<Dashboard role={role} handleLogout={handleLogout} token={token} />} />
							<Route
								path='/create-user'
								element={<CreateUser token={token} handleLogout={handleLogout} role={role} />}
							/>
							<Route
								path='/leave-request'
								element={<LeaveRequestForm token={token} handleLogout={handleLogout} role={role} />}
							/>
							<Route
								path='/calendars-list'
								element={
									[
										'Admin',
										'Zarząd',
										'Kierownik IT',
										'Kierownik BOK',
										'Kierownik Bukmacher',
										'Kierownik Marketing',
										'Urlopy czas pracy',
									].some(role => JSON.parse(localStorage.getItem('roles') || sessionStorage.getItem('roles') || '[]').includes(role)) ? (
										<AdminUserList token={token} role={role} handleLogout={handleLogout} />
									) : (
										<Navigate to='/' />
									)
								}
							/>
							<Route
								path='/leave-list'
								element={
									[
										'Admin',
										'Zarząd',
										'Kierownik IT',
										'Kierownik BOK',
										'Kierownik Bukmacher',
										'Kierownik Marketing',
										'Urlopy czas pracy',
									].some(role => JSON.parse(localStorage.getItem('roles') || sessionStorage.getItem('roles') || '[]').includes(role)) ? (
										<VacationListUser token={token} role={role} handleLogout={handleLogout} />
									) : (
										<Navigate to='/' />
									)
								}
							/>
							<Route
								path='/leave-requests/:userId'
								element={
									[
										'Admin',
										'Zarząd',
										'Kierownik IT',
										'Kierownik BOK',
										'Kierownik Bukmacher',
										'Kierownik Marketing',
										'Urlopy czas pracy',
									].some(role => JSON.parse(localStorage.getItem('roles') || sessionStorage.getItem('roles') || '[]').includes(role)) ? (
										<AdminLeaveRequests token={token} role={role} handleLogout={handleLogout} />
									) : (
										<Navigate to='/' />
									)
								}
							/>
							<Route
								path='/leave-request-pdf-preview'
								element={<LeaveRequestPDFPreview token={token} role={role} handleLogout={handleLogout} />}
							/>
							<Route
								path='/change-password'
								element={<ChangePassword token={token} role={role} handleLogout={handleLogout} />}
							/>
							<Route
								path='/logs'
								element={
									['Admin'].some(role => JSON.parse(localStorage.getItem('roles') || sessionStorage.getItem('roles') || sessionStorage.getItem('roles') || '[]').includes(role)) ? (
										<Logs token={token} role={role} handleLogout={handleLogout} />
									) : (
										<Navigate to='/' />
									)
								}
							/>
							<Route
								path='/work-calendars/:userId'
								element={
									[
										'Admin',
										'Zarząd',
										'Kierownik IT',
										'Kierownik BOK',
										'Kierownik Bukmacher',
										'Kierownik Marketing',
										'Urlopy czas pracy',
									].some(role => JSON.parse(localStorage.getItem('roles') || sessionStorage.getItem('roles') || sessionStorage.getItem('roles') || '[]').includes(role)) ? (
										<UserCalendar token={token} role={role} handleLogout={handleLogout} />
									) : (
										<Navigate to='/' />
									)
								}
							/>
							{/* Nowe trasy */}
							<Route
								path='/leave-planner'
								element={<LeavePlanner token={token} role={role} handleLogout={handleLogout} />}
							/>
							<Route
								path='/leave-planning-list'
								element={
									[
										'Admin',
										'Zarząd',
										'Kierownik IT',
										'Kierownik BOK',
										'Kierownik Bukmacher',
										'Kierownik Marketing',
										'Urlopy czas pracy',
									].some(role => JSON.parse(localStorage.getItem('roles') || sessionStorage.getItem('roles') || '[]').includes(role)) ? (
										<EmployeeListPlanner token={token} />
									) : (
										<Navigate to='/' />
									)
								}
							/>
							<Route
								path='/leave-plans/:userId'
								element={
									[
										'Admin',
										'Zarząd',
										'Kierownik IT',
										'Kierownik BOK',
										'Kierownik Bukmacher',
										'Kierownik Marketing',
										'Urlopy czas pracy',
									].some(role => JSON.parse(localStorage.getItem('roles') || sessionStorage.getItem('roles') || '[]').includes(role)) ? (
										<EmployeeLeaveCalendar token={token} />
									) : (
										<Navigate to='/' />
									)
								}
							/>
							<Route
								path='/all-leave-plans'
								element={<AdminAllLeaveCalendar token={token} role={role} handleLogout={handleLogout} />}
							/>
						</Route>
					</Routes>
				</div>
			</Router>
		</>
	)
}

export default App
