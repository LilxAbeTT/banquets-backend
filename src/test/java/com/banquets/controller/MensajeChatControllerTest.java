package com.banquets.controller;

import com.banquets.entity.MensajeChat;
import com.banquets.service.MensajeChatService;
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

@WebMvcTest(controllers = ChatController.class)
@Import(TestServiceConfig.class)
public class MensajeChatControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MensajeChatService mensajeChatService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void enviarMensaje() throws Exception {
        MensajeChat mensaje = new MensajeChat();
        mensaje.setIdMensaje(1);

        when(mensajeChatService.crearMensaje(any())).thenReturn(mensaje);

        mockMvc.perform(post("/api/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(mensaje)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idMensaje").value(1));
    }

    @Test
    void obtenerMensajes() throws Exception {
        MensajeChat mensaje = new MensajeChat();
        mensaje.setIdMensaje(1);

        when(mensajeChatService.obtenerPorRecoleccion(1)).thenReturn(List.of(mensaje));

        mockMvc.perform(get("/api/chat/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].idMensaje").value(1));
    }
}
