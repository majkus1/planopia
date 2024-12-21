import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function SetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [position, setPosition] = useState(''); // Dodajemy stanowisko
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Hasła nie pasują do siebie, spróbuj ponownie.');
            return;
        }
        try {
            const response = await axios.post('https://planopia.pl/api/users/set-password', { 
                password, 
                token, 
                position // Dodajemy stanowisko do danych wysyłanych do backendu
            });
            alert('Twoje hasło zostało pomyślnie ustawione!');
            navigate('/');
        } catch (error) {
            alert('Błąd przy ustawianiu hasła, spróbuj ponownie.');
        }
    };

    return (
        <div className="container set-pass" style={{ maxWidth: '400px' }}>
            <h2>Ustaw hasło i stanowisko</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Nowe hasło</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Potwierdź nowe hasło</label>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="position" className="form-label">Stanowisko</label>
                    <input
                        type="text"
                        className="form-control"
                        id="position"
                        value={position}
                        onChange={e => setPosition(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success">Zatwierdź</button>
            </form>
        </div>
    );
}

export default SetPassword;
