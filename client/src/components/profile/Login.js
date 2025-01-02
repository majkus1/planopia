import React, { useState, useEffect } from "react";
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
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      navigate(from);
    }
  }, [navigate, from]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://planopia.pl/api/users/login", { username, password });

      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem("token", response.data.token);
      storage.setItem("roles", JSON.stringify(response.data.roles));
      storage.setItem("username", response.data.username);

      setToken(response.data.token);
      setRole(response.data.roles);
      setLoggedIn(true);

      navigate(from);
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
          <div style={{ backgroundColor: "#213555" }}>
            {/* <img src="/img/logo.webp" alt="Logo" className="img-fluid" style={{ width: '40px' }} /> */}
            <p className="company-txt">planopia</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body login-card-body padr">
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
              <div>
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="rememberMe" style={{ marginLeft: "5px", fontWeight: "normal", cursor: "pointer" }}>Zapamiętaj mnie</label>
        </div>
              <div className="btnlog">
                <button type="submit" className="btn btn-success btn-block" style={{ marginBottom: '10px' }}>
                  Zaloguj się
                </button>
              </div>
              <Link to="/reset-password" className="text-center" style={{ textDecoration: "none", color: "#696969" }}>Nie pamiętam hasła</Link>
            </form>
            {errorMessage && <p className="mt-3 text-danger" style={{ textAlign: 'center' }}>{errorMessage}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
