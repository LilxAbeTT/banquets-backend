package com.banquets.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class BitacoraService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void registrarEvento(Integer idUsuario, String tipoOperacion, String modulo, Integer idEntidad, String descripcion, String ip, String agente) {
        jdbcTemplate.update("""
            INSERT INTO Bitacora (
                id_usuario, tipo_operacion, modulo_afectado, id_entidad_afectada,
                descripcion_evento, direccion_ip, navegador_agente, fecha_evento
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, idUsuario, tipoOperacion, modulo, idEntidad, descripcion, ip, agente, LocalDateTime.now());
    }

    public List<Map<String, Object>> consultarBitacora() {
        return jdbcTemplate.queryForList("SELECT * FROM V_BITACORA_COMPLETA ORDER BY fecha_evento DESC");
    }
}
