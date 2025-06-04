// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/axios'; // Importa tu instancia de axios configurada

// Crea el contexto de autenticación
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Almacena { token, idUsuario, tipoUsuario, nombre }
  const [loading, setLoading] = useState(true); // Para manejar el estado de carga inicial

  // Efecto para cargar el usuario desde localStorage al inicio
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('usuario');
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Asegurarse de que idUsuario esté presente aquí
        setUser({ ...parsedUser, token: storedToken, idUsuario: parsedUser.idUsuario });
      } catch (e) {
        console.error("Error al parsear usuario desde localStorage", e);
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
      // Destructurar también idUsuario
      const { token, tipoUsuario, nombre, idUsuario } = res.data; // <--- Destructurar idUsuario

      // Guardar idUsuario en userData
      const userData = { token, tipoUsuario, nombre, idUsuario }; // <--- Incluir idUsuario
      setUser(userData);
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify({ tipoUsuario, nombre, idUsuario })); // <--- Guardar idUsuario en localStorage

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
      // Asegúrate de que idUsuario se mantenga si se actualiza solo el nombre/telefono
      localStorage.setItem('usuario', JSON.stringify({
        tipoUsuario: updatedUser.tipoUsuario,
        nombre: updatedUser.nombre,
        idUsuario: updatedUser.idUsuario // <--- Asegurarse de que idUsuario se persista
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