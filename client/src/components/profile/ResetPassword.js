import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://planopia.pl/api/users/reset-password-request', { email });
            setMessage('Jeśli adres email jest zarejestrowany, link do resetowania hasła został wysłany.');
            setTimeout(() => {
                navigate('/login');
            }, 5000); // Przekierowuje z powrotem do logowania po 5 sekundach
        } catch (error) {
            setMessage('Wystąpił problem z wysłaniem linku do resetowania hasła.');
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value.toLowerCase());
    };

    return (
        <div className="reset-password-container">
            <h2>Resetowanie Hasła</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Adres Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success" style={{ marginBottom: '10px' }}>Wyślij Link Resetujący</button>
                {message && <p style={{ maxWidth: '300px' }}>{message}</p>}
            </form>
        </div>
    );
}

export default ResetPassword;
