package com.banquets.service;

import com.banquets.entity.Donacion;
import com.banquets.repository.DonacionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(MockitoExtension.class)
class DonacionServiceTest {

    @Mock
    private DonacionRepository donacionRepository;

    @InjectMocks
    private DonacionService donacionService;

    private Donacion donacion;

    @BeforeEach
    void setUp() {
        donacion = new Donacion();
        donacion.setIdDonacion(1);
        donacion.setTitulo("Donación Test");
    }

    @Test
    void crearDonacion_Correcto() {
        when(donacionRepository.save(any())).thenReturn(donacion);

        Donacion resultado = donacionService.crearDonacion(donacion);

        assertNotNull(resultado);
        verify(donacionRepository).save(donacion);
    }

    @Test
    void obtenerPorDonadorYEstado() {
        when(donacionRepository.findByDonadorIdDonadorAndEstado(1, "pendientes"))
                .thenReturn(List.of(donacion));

        List<Donacion> lista = donacionService.obtenerPorDonadorYEstado(1, "pendientes");

        assertFalse(lista.isEmpty());
        assertEquals("Donación Test", lista.get(0).getTitulo());
    }

    @Test
    void actualizarEstado_DonacionExistente() {
        when(donacionRepository.findById(1)).thenReturn(Optional.of(donacion));
        when(donacionRepository.save(any())).thenReturn(donacion);

        Donacion actualizada = donacionService.actualizarEstado(1, "en_proceso");

        assertEquals("en_proceso", actualizada.getEstado());
    }

    @Test
    void actualizarEstado_DonacionNoExistente() {
        when(donacionRepository.findById(1)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            donacionService.actualizarEstado(1, "en_proceso");
        });

        assertEquals("Donación no encontrada", ex.getMessage());
    }
}
