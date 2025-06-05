// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/axios'; // Importa tu instancia de axios configurada

// Crea el contexto de autenticación
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Almacena { token, idUsuario, tipoUsuario, nombre, latitud, longitud }
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Efecto para cargar el usuario desde localStorage al inicio
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('usuario'); // Este ya es JSON.stringify
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Asegurarse de que idUsuario, latitud y longitud estén presentes aquí
        setUser({
          ...parsedUser,
          token: storedToken,
          idUsuario: parsedUser.idUsuario,
          latitud: parsedUser.latitud,   // <--- Incluir latitud
          longitud: parsedUser.longitud  // <--- Incluir longitud
        });
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
      // Destructurar idUsuario, latitud y longitud
      const { token, tipoUsuario, nombre, idUsuario, latitud, longitud } = res.data;

      // Guardar toda la información relevante en userData
      const userData = { token, tipoUsuario, nombre, idUsuario, latitud, longitud };
      setUser(userData);
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify({ tipoUsuario, nombre, idUsuario, latitud, longitud }));

      return true; // Login exitoso
    } catch (error) {
      console.error('Error en el login:', error);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      throw error;
    }
  };

  // Función de logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    delete api.defaults.headers.common['Authorization'];
    console.log("Sesión cerrada");
  };

  // Función para actualizar datos del usuario en el contexto
  const updateUserContext = (newUserData) => {
    setUser(prevUser => {
      const updatedUser = { ...prevUser, ...newUserData };
      // Asegurarse de que toda la información relevante se persista
      localStorage.setItem('usuario', JSON.stringify({
        tipoUsuario: updatedUser.tipoUsuario,
        nombre: updatedUser.nombre,
        idUsuario: updatedUser.idUsuario,
        latitud: updatedUser.latitud,
        longitud: updatedUser.longitud
      }));
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