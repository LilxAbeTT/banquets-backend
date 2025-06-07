package com.banquets.service;

import com.banquets.dto.RespuestaSoporteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class SoporteService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void responderMensaje(RespuestaSoporteDTO dto, Integer idAdmin) {
        jdbcTemplate.update("EXEC sp_responder_mensaje_soporte ?, ?, ?",
                dto.getIdMensaje(),
                dto.getRespuesta(),
                idAdmin);
    }
}
