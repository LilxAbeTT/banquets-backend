// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/axios'; // Importa tu instancia de axios configurada

// Crea el contexto de autenticación
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Almacena { token, id, tipoUsuario, nombre }
  const [loading, setLoading] = useState(true); // Para manejar el estado de carga inicial

  // Efecto para cargar el usuario desde localStorage al inicio
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('usuario'); // Este ya es JSON.stringify
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({ ...parsedUser, token: storedToken });
      } catch (e) {
        console.error("Error al parsear usuario desde localStorage", e);
        // Si hay un error, limpiar el localStorage para evitar bucles
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  // Función de login
  const login = async (correo, contrasena) => {
    try {
      const res = await api.post('/auth/login', { correo, contrasena });
      const { token, tipoUsuario, nombre } = res.data;

      const userData = { token, tipoUsuario, nombre };
      setUser(userData);
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify({ tipoUsuario, nombre })); // No guardar el token en el objeto 'usuario' si ya está por separado

      return true; // Login exitoso
    } catch (error) {
      console.error('Error en el login:', error);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      throw error; // Propagar el error para que el componente de Login lo maneje
    }
  };

  // Función de logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    // Si usas axios para la redirección, puedes limpiar headers aquí si lo necesitas
    delete api.defaults.headers.common['Authorization'];
    console.log("Sesión cerrada");
  };

  // Función para actualizar datos del usuario en el contexto
  const updateUserContext = (newUserData) => {
    setUser(prevUser => {
      const updatedUser = { ...prevUser, ...newUserData };
      localStorage.setItem('usuario', JSON.stringify({ tipoUsuario: updatedUser.tipoUsuario, nombre: updatedUser.nombre }));
      return updatedUser;
    });
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUserContext
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};