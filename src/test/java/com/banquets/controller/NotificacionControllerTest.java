package com.banquets.controller;

import com.banquets.entity.Notificacion;
import com.banquets.service.NotificacionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = NotificacionController.class)
@Import(TestServiceConfig.class)
public class NotificacionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private NotificacionService notificacionService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void crearNotificacion() throws Exception {
        Notificacion notificacion = new Notificacion();
        notificacion.setIdNotificacion(1);

        when(notificacionService.crearNotificacion(any())).thenReturn(notificacion);

        mockMvc.perform(post("/api/notificaciones")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(notificacion)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idNotificacion").value(1));
    }

    @Test
    void obtenerPorUsuario() throws Exception {
        Notificacion notificacion = new Notificacion();
        notificacion.setIdNotificacion(1);

        when(notificacionService.obtenerPorUsuario(1)).thenReturn(List.of(notificacion));

        mockMvc.perform(get("/api/notificaciones/usuario/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].idNotificacion").value(1));
    }
}
