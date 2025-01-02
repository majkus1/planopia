import React from 'react'
import { useLocation } from 'react-router-dom'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import Sidebar from '../dashboard/Sidebar'

function LeaveRequestPDFPreview({ role, handleLogout }) {
	const location = useLocation()
	const leaveRequest = location.state?.leaveRequest

	const generatePDF = async () => {
		const element = document.getElementById('pdf-content')
		const canvas = await html2canvas(element)
		const imgData = canvas.toDataURL('image/png')
		const pdf = new jsPDF('p', 'mm', 'a4')
		pdf.addImage(imgData, 'PNG', 10, 10, 190, 0)
		pdf.save(`wniosek_urlopowy_${leaveRequest.userId.lastName}.pdf`)
	}

	const formatDate = date => {
		const options = { day: '2-digit', month: 'long', year: 'numeric' }
		return new Date(date).toLocaleDateString('pl-PL', options)
	}

	return (
		<>
			<Sidebar handleLogout={handleLogout} role={role} username={localStorage.getItem('username') || sessionStorage.getItem('username')} />

			<div id='pdf-leave-request'>
				<div id='pdf-content' style={{ padding: '20px', paddingTop: '70px' }}>
					<h2 style={{ marginBottom: '20px' }}>Wniosek urlopowy</h2>
					<div className='allrequests'>
						<div className='firsttworow'>
							<div className='detailsleave'>
								<p>
									<strong>Data zgłoszenia:</strong> {formatDate(leaveRequest.createdAt)}
								</p>
								<p>
									<strong>Imię i nazwisko:</strong> {leaveRequest.userId.firstName} {leaveRequest.userId.lastName}
								</p>
								<p>
									<strong>Stanowisko:</strong> {leaveRequest.userId.position}
								</p>
								<p>
									<strong>Rodzaj urlopu:</strong> {leaveRequest.type}
								</p>
								<p>
									<strong>Data od:</strong> {formatDate(leaveRequest.startDate)}
								</p>
								<p>
									<strong>Data do:</strong> {formatDate(leaveRequest.endDate)}
								</p>
								<p>
									<strong>Liczba dni:</strong> {leaveRequest.daysRequested}
								</p>
								<p>
									<strong>Osoba zastępująca:</strong> {leaveRequest.replacement || 'Brak'}
								</p>
								<p>
									<strong>Uwagi:</strong> {leaveRequest.additionalInfo || 'Brak'}
								</p>
							</div>
							<div className='othertwo'>
								<div className='resumedaysleave'>
									<p>URLOP POZOSTAŁY ZA ROK BIEŻĄCY....................</p>
									<p>URLOP ZALEGŁY NIEWYKORZYSTANY....................</p>
									<p>W TYM URLOP NA ŻĄDANIE....................</p>
									<p>OGÓŁEM DNI URLOPU DO WYKORZYSTANIA....................</p>
								</div>
								<div className='signature-leave' style={{ margin: '35px 0px' }}>
									<p>
										<strong>Pracownik (podpis):</strong>....................
									</p>
									<p>
										<strong>Bezpośredni przełożony (podpis):</strong>....................
									</p>
									<p>
										<strong>Dyrektor / Zarząd (podpis):</strong>....................
									</p>
									<p>
										<strong>Dział personalny (podpis):</strong>....................
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<button onClick={generatePDF} className='btn btn-primary btn-print-leavereq' style={{ marginLeft: '17px' }}>
					Generuj PDF
				</button>
			</div>
		</>
	)
}

export default LeaveRequestPDFPreview
