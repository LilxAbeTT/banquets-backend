package com.banquets.service;

import com.banquets.entity.Recoleccion;
import com.banquets.repository.RecoleccionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(MockitoExtension.class)
class RecoleccionServiceTest {

    @Mock
    private RecoleccionRepository recoleccionRepository;

    @InjectMocks
    private RecoleccionService recoleccionService;

    private Recoleccion recoleccion;

    @BeforeEach
    void setUp() {
        recoleccion = new Recoleccion();
        recoleccion.setIdRecoleccion(1);
    }

    @Test
    void crearRecoleccion_Correcto() {
        when(recoleccionRepository.save(any())).thenReturn(recoleccion);

        Recoleccion resultado = recoleccionService.crearRecoleccion(recoleccion);

        assertNotNull(resultado);
        verify(recoleccionRepository).save(recoleccion);
    }

    @Test
    void obtenerPorOrganizacion() {
        when(recoleccionRepository.findByOrganizacionIdOrganizacion(1))
                .thenReturn(List.of(recoleccion));

        List<Recoleccion> lista = recoleccionService.obtenerPorOrganizacion(1);

        assertFalse(lista.isEmpty());
    }

    @Test
    void obtenerPorDonador() {
        when(recoleccionRepository.findByDonacionDonadorIdDonador(1))
                .thenReturn(List.of(recoleccion));

        List<Recoleccion> lista = recoleccionService.obtenerPorDonador(1);

        assertFalse(lista.isEmpty());
    }
}
