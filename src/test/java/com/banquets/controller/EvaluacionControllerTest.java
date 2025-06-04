package com.banquets.controller;

import com.banquets.entity.Evaluacion;
import com.banquets.service.EvaluacionService;
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

@WebMvcTest(controllers = EvaluacionController.class)
@Import(TestServiceConfig.class)
public class EvaluacionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EvaluacionService evaluacionService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void crearEvaluacion() throws Exception {
        Evaluacion eval = new Evaluacion();
        eval.setIdEvaluacion(1);

        when(evaluacionService.crearEvaluacion(any())).thenReturn(eval);

        mockMvc.perform(post("/api/evaluaciones")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(eval)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idEvaluacion").value(1));
    }

    @Test
    void listarEvaluaciones() throws Exception {
        Evaluacion eval = new Evaluacion();
        eval.setIdEvaluacion(1);

        when(evaluacionService.obtenerPorDonador(1)).thenReturn(List.of(eval));

        mockMvc.perform(get("/api/evaluaciones")
                        .param("idUsuario", "1")
                        .param("tipoUsuario", "DONADOR")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].idEvaluacion").value(1));
    }
}
