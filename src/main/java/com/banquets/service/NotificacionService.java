package com.banquets.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class NotificacionService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> obtenerNotificacionesPorUsuario(Integer idUsuario) {
        String sql = "SELECT * FROM V_NOTIFICACIONES_USUARIO WHERE id_usuario = ? ORDER BY fecha DESC";
        return jdbcTemplate.queryForList(sql, idUsuario);
    }

    public void marcarComoLeida(Integer idNotificacion) {
        jdbcTemplate.update("UPDATE Notificacion SET leida = 1 WHERE id_notificacion = ?", idNotificacion);
    }

    public void crearNotificacion(Integer idUsuario, String mensaje) {
        jdbcTemplate.update("""
            INSERT INTO Notificacion (id_usuario, mensaje)
            VALUES (?, ?)
        """, idUsuario, mensaje);
    }
}
