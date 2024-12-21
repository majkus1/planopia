import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function EmployeeLeaveCalendar({ token }) {
  const { userId } = useParams();
  const [leavePlans, setLeavePlans] = useState([]);
  const currentYear = new Date().getFullYear();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserDetails();
    fetchLeavePlans();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`https://planopia.pl/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
  };

  const fetchLeavePlans = async () => {
    try {
      const response = await axios.get(`https://planopia.pl/api/users/admin/leave-plans/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeavePlans(response.data); // Assume API returns an array of dates
    } catch (error) {
      console.error('Error fetching leave plans:', error);
    }
  };



  const renderMonths = () => {
    return Array.from({ length: 12 }, (_, month) => (
      <div key={month} className="month-calendar" style={{ margin: "10px", border: "1px solid #ddd" }}>
        <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        initialDate={new Date(currentYear, month)}
        locale="pl"
        height="auto"
        showNonCurrentDates={false}
        events={leavePlans.map((date) => ({
          title: 'Urlop',
          start: date,
          allDay: true,
          backgroundColor: 'blue',
        }))}
      />
      </div>
    ));
  };

  return (
    <div>
      {user && <h3>Kalendarz planowanych urlopów: {user.username}</h3>}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {renderMonths()}
      </div>
    </div>
  );
}

export default EmployeeLeaveCalendar;
