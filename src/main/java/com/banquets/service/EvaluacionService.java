package com.banquets.service;

import com.banquets.dto.EvaluacionDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class EvaluacionService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void evaluar(EvaluacionDTO dto, Integer idOrganizacion) {
        // Ejecutar el procedimiento
        jdbcTemplate.update("EXEC sp_evaluar_recoleccion ?, ?, ?",
                dto.getIdRecoleccion(),
                dto.getEstrellas(),
                dto.getComentario());


    }
}