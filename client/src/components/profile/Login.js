import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import "admin-lte/dist/css/adminlte.min.css";

import "admin-lte/plugins/jquery/jquery.min.js";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "admin-lte/dist/js/adminlte.min.js";

function Login({ setLoggedIn, setRole, setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"; // Pobierz ścieżkę docelową z state lub ustaw domyślnie na "/"

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://planopia.pl/api/users/login", { username, password });
      
      // Zapisujemy token i roles w localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("roles", JSON.stringify(response.data.roles)); // Konwertujemy tablicę na string
      localStorage.setItem("username", response.data.username);

      // Ustawiamy dane w state
      setToken(response.data.token);
      setRole(response.data.roles); // Przypisujemy tablicę ról
      setLoggedIn(true);

      navigate(from); // Przekieruj do ścieżki docelowej
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Logowanie nie powiodło się");
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value.toLowerCase());
  };

  return (
    <div className="alllogin">
      <div className="login-box">
        <div className="login-logo">
          <div className="bg-dark">
            {/* <img src="/img/logo.webp" alt="Logo" className="img-fluid" style={{ width: '40px' }} /> */}
            <p className="company-txt">planopia</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body login-card-body">
            <form onSubmit={handleLogin}>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email"
                  value={username}
                  onChange={handleUsernameChange}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-envelope"></span>
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Hasło"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock"></span>
                  </div>
                </div>
              </div>
              <div className="btnlog">
                <button type="submit" className="btn btn-success btn-block" style={{ marginBottom: '10px' }}>
                  Zaloguj się
                </button>
              </div>
              <Link to="/reset-password" className="text-center">Nie pamiętam hasła</Link>
            </form>
            {errorMessage && <p className="mt-3 text-danger" style={{ textAlign: 'center' }}>{errorMessage}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
