import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../dashboard/Sidebar';

function CreateUser({ handleLogout, role }) {
  const availableRoles = [
    'Admin',
    'IT',
    'Marketing',
    'Bukmacher',
    'Bok',
    'Kierownik IT',
    'Kierownik BOK',
    'Kierownik Bukmacher',
    'Kierownik Marketing',
    'Urlopy czas pracy',
    'Zarząd',
  ];

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [draggedRole, setDraggedRole] = useState(null);

  const handleUsernameChange = (e) => {
    const value = e.target.value.toLowerCase();
    setUsername(value);
  };

  const handleDragStart = (role) => {
    setDraggedRole(role);
  };

  const handleDrop = () => {
    if (draggedRole && !selectedRoles.includes(draggedRole)) {
      setSelectedRoles((prevRoles) => [...prevRoles, draggedRole]);
    }
    setDraggedRole(null);
  };

  const handleRoleClick = (role) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles((prevRoles) => prevRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles((prevRoles) => [...prevRoles, role]);
    }
  };

  const handleRemoveRole = (roleToRemove) => {
    setSelectedRoles((prevRoles) => prevRoles.filter((role) => role !== roleToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUser = { username, firstName, lastName, roles: selectedRoles };
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      const response = await axios.post('https://planopia.pl/api/users/register', newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        alert(
          'Użytkownik zarejestrowany. Wiadomość z informacją o ustawieniu hasła została wysłana na podany adres e-mail.'
        );
        setUsername('');
        setFirstName('');
        setLastName('');
        setSelectedRoles([]);
      } else {
        throw new Error('Błąd');
      }
    } catch (error) {
      alert('Błąd: ' + error.response?.data || error.message);
    }
  };

  return (
    <>
      <Sidebar handleLogout={handleLogout} role={role} username={localStorage.getItem('username') || sessionStorage.getItem('username')} />
      <div className="container my-5 d-flex justify-content-center align-items-center">
        <div className="row justify-content-start">
          <div className="col-md-8">
            <div>
              <div className="card-body">
                <h4>Stwórz nowego użytkownika</h4>
                <hr></hr>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="username"
                      value={username}
                      onChange={handleUsernameChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">
                      Imię
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">
                      Nazwisko
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="roles" className="form-label">
                      Nadaj role
                    </label>
                    <div className="d-flex">
                      <div
                        className="available-roles p-3 me-3"
                        style={{ minWidth: '200px', minHeight: '100px' }}
                      >
                        <p>Dostępne role</p>
                        {availableRoles.map((role) => (
                          <div
                            key={role}
                            draggable
                            onDragStart={() => handleDragStart(role)}
                            onClick={() => handleRoleClick(role)}
                            className={`border p-2 my-1 ${
                              selectedRoles.includes(role) ? 'bg-primary text-white' : 'bg-light'
                            }`}
                            style={{ cursor: "pointer" }}
                          >
                            {role}
                          </div>
                        ))}
                      </div>
                      <div
                        className="selected-roles p-3"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                      >
                        <p>Wybrane role</p>
                        {selectedRoles.map((role) => (
                          <div
                            key={role}
                            className="border p-2 my-1 bg-success text-white d-flex justify-content-between"
                          >
                            <span>{role}</span>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm ms-2"
                              onClick={() => handleRemoveRole(role)}
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-success">
                    Rejestruj
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateUser;
