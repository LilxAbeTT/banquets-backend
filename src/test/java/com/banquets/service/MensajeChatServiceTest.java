package com.banquets.service;

import com.banquets.entity.MensajeChat;
import com.banquets.repository.MensajeChatRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(MockitoExtension.class)
class MensajeChatServiceTest {

    @Mock
    private MensajeChatRepository mensajeChatRepository;

    @InjectMocks
    private MensajeChatService mensajeChatService;

    private MensajeChat mensajeChat;

    @BeforeEach
    void setUp() {
        mensajeChat = new MensajeChat();
        mensajeChat.setIdMensaje(1);
    }

    @Test
    void crearMensaje_Correcto() {
        when(mensajeChatRepository.save(any())).thenReturn(mensajeChat);

        MensajeChat resultado = mensajeChatService.crearMensaje(mensajeChat);

        assertNotNull(resultado);
        verify(mensajeChatRepository).save(mensajeChat);
    }

    @Test
    void obtenerPorRecoleccion_Correcto() {
        when(mensajeChatRepository.findByRecoleccionIdRecoleccionOrderByFechaAsc(1))
                .thenReturn(List.of(mensajeChat));

        List<MensajeChat> lista = mensajeChatService.obtenerPorRecoleccion(1);

        assertFalse(lista.isEmpty());
    }
}
