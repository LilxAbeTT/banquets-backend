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
import RecuperarPassword from './pages/auth/RecuperarPassword'; // ajusta según la ruta real


const App = () => {
  return (
      <div className="min-h-screen bg-fondo text-texto">
        <Routes>
          <Route path="/" element={<Bienvenida />} />
          <Route path="*" element={
            <>
              <Navbar />
              <Routes>
                <Route path="/Login" element={<Login />} />
                <Route path="/donador/dashboard" element={<DashboardDonador />} />
                <Route path="/donador/publicar" element={<PublicarDonacion />} />
                <Route path="/donador/perfil" element={<PerfilDonador />} />
                <Route path="/organizacion/dashboard" element={<DashboardOrganizacion />} />
                <Route path="/organizacion/perfil" element={<PerfilOrganizacion />} />
                <Route path="/admin/dashboard" element={<DashboardAdmin />} />
                <Route path="/soporte/chat" element={<ChatSoporte />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="*" element={<Error404 />} />
                <Route path="/saber-mas" element={<SaberMas />} />
                <Route path="/recuperar-password" element={<RecuperarPassword />} />
              </Routes>
            </>
          } />
        </Routes>
      </div>
  );
};

export default App;
