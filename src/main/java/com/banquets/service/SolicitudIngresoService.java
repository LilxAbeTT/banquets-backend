package com.banquets.service;

import com.banquets.dto.SolicitudIngresoDTO;
import com.banquets.entity.SolicitudIngreso;
import jakarta.mail.MessagingException;

import java.util.List;

public interface SolicitudIngresoService {
    SolicitudIngreso crearDesdeDTO(SolicitudIngresoDTO dto);
    SolicitudIngreso actualizarEstado(Integer idSolicitud, String estado);
    SolicitudIngreso aprobar(Integer idSolicitud, String ip, String agente) throws MessagingException;
    SolicitudIngreso rechazar(Integer idSolicitud, String motivo, String ip, String agente) throws MessagingException;

    List<SolicitudIngreso> listarPorEstado(String estado);

}
