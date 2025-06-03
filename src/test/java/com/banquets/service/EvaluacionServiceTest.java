package com.banquets.service;

import com.banquets.entity.Evaluacion;
import com.banquets.repository.EvaluacionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(MockitoExtension.class)
class EvaluacionServiceTest {

    @Mock
    private EvaluacionRepository evaluacionRepository;

    @InjectMocks
    private EvaluacionService evaluacionService;

    private Evaluacion evaluacion;

    @BeforeEach
    void setUp() {
        evaluacion = new Evaluacion();
        evaluacion.setIdEvaluacion(1);
    }

    @Test
    void crearEvaluacion_Correcto() {
        when(evaluacionRepository.save(any())).thenReturn(evaluacion);

        Evaluacion resultado = evaluacionService.crearEvaluacion(evaluacion);

        assertNotNull(resultado);
        verify(evaluacionRepository).save(evaluacion);
    }

    @Test
    void obtenerPorOrganizacion() {
        when(evaluacionRepository.findByRecoleccionOrganizacionIdOrganizacion(1))
                .thenReturn(List.of(evaluacion));

        List<Evaluacion> lista = evaluacionService.obtenerPorOrganizacion(1);

        assertFalse(lista.isEmpty());
    }

    @Test
    void obtenerPorDonador() {
        when(evaluacionRepository.findByRecoleccionDonacionDonadorIdDonador(1))
                .thenReturn(List.of(evaluacion));

        List<Evaluacion> lista = evaluacionService.obtenerPorDonador(1);

        assertFalse(lista.isEmpty());
    }
}
