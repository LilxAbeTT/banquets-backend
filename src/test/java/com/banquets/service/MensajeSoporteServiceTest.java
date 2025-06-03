package com.banquets.service;

import com.banquets.entity.MensajeSoporte;
import com.banquets.repository.MensajeSoporteRepository;
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
class MensajeSoporteServiceTest {

    @Mock
    private MensajeSoporteRepository mensajeSoporteRepository;

    @InjectMocks
    private MensajeSoporteService mensajeSoporteService;

    private MensajeSoporte mensaje;

    @BeforeEach
    void setUp() {
        mensaje = new MensajeSoporte();
        mensaje.setIdMensaje(1);
        mensaje.setRespondido(false);
    }

    @Test
    void crearMensaje_Correcto() {
        when(mensajeSoporteRepository.save(any())).thenReturn(mensaje);

        MensajeSoporte resultado = mensajeSoporteService.crearMensaje(mensaje);

        assertNotNull(resultado);
        verify(mensajeSoporteRepository).save(mensaje);
    }

    @Test
    void marcarRespondido_Correcto() {
        when(mensajeSoporteRepository.findById(1)).thenReturn(Optional.of(mensaje));
        when(mensajeSoporteRepository.save(any())).thenReturn(mensaje);

        MensajeSoporte actualizado = mensajeSoporteService.marcarRespondido(1);

        assertTrue(actualizado.getRespondido());
    }

    @Test
    void marcarRespondido_NoExiste() {
        when(mensajeSoporteRepository.findById(1)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            mensajeSoporteService.marcarRespondido(1);
        });

        assertEquals("Mensaje no encontrado", ex.getMessage());
    }

    @Test
    void listarPendientes_Correcto() {
        when(mensajeSoporteRepository.findByRespondidoFalse()).thenReturn(List.of(mensaje));

        List<MensajeSoporte> lista = mensajeSoporteService.listarPendientes();

        assertFalse(lista.isEmpty());
    }
}
