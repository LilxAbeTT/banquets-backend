// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Login from './pages/auth/Login';
import DashboardDonador from './pages/donador/DashboardDonador';
import PublicarDonacion from './pages/donador/PublicarDonacion';
import PerfilDonador from './pages/donador/PerfilDonador';
import DashboardOrganizacion from './pages/organizacion/DashboardOrganizacion';
import PerfilOrganizacion from './pages/organizacion/PerfilOrganizacion';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import Error404 from './pages/Error404';
import ChatSoporte from './pages/ChatSoporte';
import Bienvenida from './pages/landing/Bienvenida';
import Registro from './pages/auth/Registro';
import SaberMas from './pages/landing/SaberMas';
import RecuperarPassword from './pages/auth/RecuperarPassword';
import ProtectedRoute from './components/ProtectedRoute'; // <--- Importa ProtectedRoute

const App = () => {
  return (
      <div className="min-h-screen bg-fondo text-texto">
        <Routes>
          {/* Rutas públicas que no requieren autenticación */}
          <Route path="/" element={<Bienvenida />} />
          <Route path="/login" element={<Login />} /> {/* Login también debe ser público */}
          <Route path="/registro" element={<Registro />} />
          <Route path="/saber-mas" element={<SaberMas />} />
          <Route path="/recuperar-password" element={<RecuperarPassword />} />

          {/* Grupo de rutas que siempre tendrán el Navbar */}
          {/* Se usará un asterisco (*) para que todas las demás rutas intenten mostrar el Navbar */}
          <Route path="*" element={
            <>
              <Navbar />
              <Routes>
                {/* Rutas protegidas para DONADOR */}
                <Route path="/donador/dashboard" element={<ProtectedRoute allowedRoles={['DONADOR']}><DashboardDonador /></ProtectedRoute>} />
                <Route path="/donador/publicar" element={<ProtectedRoute allowedRoles={['DONADOR']}><PublicarDonacion /></ProtectedRoute>} />
                <Route path="/donador/perfil" element={<ProtectedRoute allowedRoles={['DONADOR']}><PerfilDonador /></ProtectedRoute>} />

                {/* Rutas protegidas para ORGANIZACION */}
                <Route path="/organizacion/dashboard" element={<ProtectedRoute allowedRoles={['ORGANIZACION']}><DashboardOrganizacion /></ProtectedRoute>} />
                <Route path="/organizacion/perfil" element={<ProtectedRoute allowedRoles={['ORGANIZACION']}><PerfilOrganizacion /></ProtectedRoute>} />

                {/* Rutas protegidas para ADMIN */}
                <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><DashboardAdmin /></ProtectedRoute>} />

                {/* Rutas de soporte que pueden ser para usuarios logueados (todos los roles) */}
                <Route path="/soporte/chat" element={<ProtectedRoute allowedRoles={['DONADOR', 'ORGANIZACION', 'ADMIN']}><ChatSoporte /></ProtectedRoute>} />

                {/* Ruta 404 para cualquier otra ruta no definida dentro de este grupo */}
                <Route path="*" element={<Error404 />} />
              </Routes>
            </>
          } />
        </Routes>
      </div>
  );
};

export default App;