package com.banquets.service;

import com.banquets.dto.SolicitudIngresoDTO;
import com.banquets.entity.SolicitudIngreso;

import java.util.List;

public interface SolicitudIngresoService {
    SolicitudIngreso crearDesdeDTO(SolicitudIngresoDTO dto);
    SolicitudIngreso actualizarEstado(Integer idSolicitud, String estado);
    SolicitudIngreso aprobar(Integer idSolicitud);
    SolicitudIngreso rechazar(Integer idSolicitud);

    List<SolicitudIngreso> listarPorEstado(String estado);
}
