package com.banquets.controller;

import com.banquets.entity.Recoleccion;
import com.banquets.service.RecoleccionService;
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

@WebMvcTest(controllers = RecoleccionController.class)
@Import(TestServiceConfig.class)
public class RecoleccionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private RecoleccionService recoleccionService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void crearRecoleccion() throws Exception {
        Recoleccion rec = new Recoleccion();
        rec.setIdRecoleccion(1);

        when(recoleccionService.crearRecoleccion(any())).thenReturn(rec);

        mockMvc.perform(post("/api/recolecciones")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(rec)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idRecoleccion").value(1));
    }

    @Test
    void listarRecolecciones() throws Exception {
        Recoleccion rec = new Recoleccion();
        rec.setIdRecoleccion(1);

        when(recoleccionService.obtenerPorUsuario(1, "DONADOR"))
                .thenReturn(List.of(rec));

        mockMvc.perform(get("/api/recolecciones")
                        .param("idUsuario", "1")
                        .param("tipoUsuario", "DONADOR")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].idRecoleccion").value(1));
    }
}
