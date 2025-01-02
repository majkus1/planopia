// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// function EmployeeListPlanner({ token }) {
//   const [employees, setEmployees] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const fetchEmployees = async () => {
//     try {
//       const response = await axios.get('https://planopia.pl/api/users/all-users', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setEmployees(response.data);
//     } catch (error) {
//       console.error('Error fetching employees:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>Lista pracowników</h2>
//       <ul>
//         {employees.map((employee) => (
//           <li key={employee._id}>
//             <button onClick={() => navigate(`/admin/leave-plans/${employee._id}`)}>
//               {employee.username}
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default EmployeeListPlanner;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminUserList({ token }) {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://planopia.pl/api/users/all-users', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setError('Nie udało się pobrać listy użytkowników. Spróbuj zalogować się ponownie.');
        }
    };

 const handleUserClick = (userId) => {
    navigate(`/leave-plans/${userId}`);
  };

    return (
        <div>
            <h2>Lista Pracowników</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {users.map(user => (
                    <li key={user._id} onClick={() => handleUserClick(user._id)}>
                        {user.username} - {user.roles.join(', ')} - {user.position || 'Brak stanowiska'}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AdminUserList;
