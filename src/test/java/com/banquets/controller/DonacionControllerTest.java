package com.banquets.controller;

import com.banquets.entity.Donacion;
import com.banquets.service.DonacionService;
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

@WebMvcTest(controllers = DonacionController.class)
@Import(TestServiceConfig.class)
public class DonacionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private DonacionService donacionService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void crearDonacion() throws Exception {
        Donacion donacion = new Donacion();
        donacion.setIdDonacion(1);
        donacion.setTitulo("Donación prueba");

        when(donacionService.crearDonacion(any())).thenReturn(donacion);

        mockMvc.perform(post("/api/donaciones")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(donacion)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.titulo").value("Donación prueba"));
    }

    @Test
    void listarDonacionesPropias() throws Exception {
        Donacion donacion = new Donacion();
        donacion.setIdDonacion(1);
        donacion.setTitulo("Donación prueba");

        when(donacionService.obtenerPorDonadorYEstado(1, "pendientes"))
                .thenReturn(List.of(donacion));

        mockMvc.perform(get("/api/donaciones/mias")
                        .param("idDonador", "1") // Si lo implementas así en controlador, o usa autenticación
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].titulo").value("Donación prueba"));
    }
}
