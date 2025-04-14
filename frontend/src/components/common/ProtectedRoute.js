import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const userData = currentUser.user || currentUser;

  if (allowedRoles && !allowedRoles.includes(userData.role)) {
    switch (userData.role) {
      case 'admin':
        return <Navigate to="/admin" />;
      case 'user':
        return <Navigate to="/user" />;
      case 'store_owner':
        return <Navigate to="/store-owner" />;
      default:
        return <Navigate to="/login" />;
    }
  }

  return children;
};

export default ProtectedRoute;