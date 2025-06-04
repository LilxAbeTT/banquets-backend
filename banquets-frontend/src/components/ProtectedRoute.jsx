// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importa useAuth

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth(); // Obtén el usuario y el estado de carga del contexto

  if (loading) {
    // Puedes mostrar un spinner o un componente de carga aquí mientras se verifica la autenticación
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-700">Cargando...</div>;
  }

  // Si no hay usuario (no autenticado)
  if (!user) {
    return <Navigate to="/login" replace />; // Redirige al login
  }

  // Si hay usuario pero no tiene los roles permitidos
  if (allowedRoles && !allowedRoles.includes(user.tipoUsuario.toUpperCase())) {
    // Puedes redirigir a una página de acceso denegado o a un dashboard predeterminado
    // Para este proyecto, redirigiremos a la página de login o al dashboard de bienvenida
    console.warn(`Acceso denegado. Rol del usuario: ${user.tipoUsuario}, Roles permitidos: ${allowedRoles}`);
    return <Navigate to="/" replace />; // O a una página de error 403
  }

  // Si el usuario está autenticado y tiene el rol permitido, renderiza los hijos de la ruta
  return children ? children : <Outlet />;
};

export default ProtectedRoute;