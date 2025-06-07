package com.banquets.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class HistorialService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> obtenerHistorialDonador(Integer idDonador) {
        String sql = "SELECT * FROM V_HISTORIAL_DONADOR WHERE id_donador = ?";
        return jdbcTemplate.queryForList(sql, idDonador);
    }

    public List<Map<String, Object>> obtenerHistorialOrganizacion(Integer idOrganizacion) {
        String sql = "SELECT * FROM V_HISTORIAL_ORGANIZACION WHERE id_organizacion = ?";
        return jdbcTemplate.queryForList(sql, idOrganizacion);
    }
}
