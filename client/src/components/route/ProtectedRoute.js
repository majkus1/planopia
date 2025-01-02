import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ isLoggedIn, token }) => {
  const location = useLocation();

  if (isLoggedIn === null) {
    // Jeśli stan zalogowania jest jeszcze nieokreślony (null), możesz wyświetlić loader lub zwrócić null
    return <div>Loading...</div>;
  }

  return isLoggedIn && token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

export default ProtectedRoute;
