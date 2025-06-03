package com.banquets.controller;

import com.banquets.config.TestServiceConfig;
import com.banquets.entity.MensajeSoporte;
import com.banquets.service.MensajeSoporteService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
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

@WebMvcTest(controllers = MensajeSoporteController.class)
@Import(TestServiceConfig.class)
public class MensajeSoporteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MensajeSoporteService mensajeSoporteService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void enviarMensaje() throws Exception {
        MensajeSoporte mensaje = new MensajeSoporte();
        mensaje.setIdMensaje(1);

        when(mensajeSoporteService.crearMensaje(any())).thenReturn(mensaje);

        mockMvc.perform(post("/api/soporte")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(mensaje)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idMensaje").value(1));
    }

    @Test
    void listarPendientes() throws Exception {
        MensajeSoporte mensaje = new MensajeSoporte();
        mensaje.setIdMensaje(1);

        when(mensajeSoporteService.listarPendientes()).thenReturn(List.of(mensaje));

        mockMvc.perform(get("/api/soporte/pendientes")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].idMensaje").value(1));
    }
}
