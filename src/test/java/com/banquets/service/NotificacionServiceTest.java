package com.banquets.service;

import com.banquets.entity.Notificacion;
import com.banquets.repository.NotificacionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(MockitoExtension.class)
class NotificacionServiceTest {

    @Mock
    private NotificacionRepository notificacionRepository;

    @InjectMocks
    private NotificacionService notificacionService;

    private Notificacion notificacion;

    @BeforeEach
    void setUp() {
        notificacion = new Notificacion();
        notificacion.setIdNotificacion(1);
    }

    @Test
    void crearNotificacion_Correcto() {
        when(notificacionRepository.save(any())).thenReturn(notificacion);

        Notificacion resultado = notificacionService.crearNotificacion(notificacion);

        assertNotNull(resultado);
        verify(notificacionRepository).save(notificacion);
    }

    @Test
    void obtenerPorUsuario_Correcto() {
        when(notificacionRepository.findByUsuarioIdUsuarioOrderByFechaDesc(1))
                .thenReturn(List.of(notificacion));

        List<Notificacion> lista = notificacionService.obtenerPorUsuario(1);

        assertFalse(lista.isEmpty());
    }
}
