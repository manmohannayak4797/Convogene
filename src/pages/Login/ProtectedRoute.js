import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ element: Element }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  return isAuthenticated ? (
    <Element />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}