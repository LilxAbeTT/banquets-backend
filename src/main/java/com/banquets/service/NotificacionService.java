package com.banquets.service;

import com.banquets.entity.Notificacion;
import com.banquets.repository.NotificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificacionService {

    @Autowired
    private NotificacionRepository notificacionRepository;

    public Notificacion crearNotificacion(Notificacion notificacion) {
        return notificacionRepository.save(notificacion);
    }

    public List<Notificacion> obtenerPorUsuario(Integer idUsuario) {
        return notificacionRepository.findByUsuarioIdUsuarioOrderByFechaDesc(idUsuario);
    }
}
