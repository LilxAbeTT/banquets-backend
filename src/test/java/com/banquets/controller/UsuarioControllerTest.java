package com.banquets.controller;

import com.banquets.config.TestServiceConfig;
import com.banquets.entity.Usuario;
import com.banquets.service.UsuarioService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = UsuarioController.class)
@Import(TestServiceConfig.class)
class UsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsuarioService usuarioService; // Este es el mock creado

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "test@example.com")
    void obtenerDatosPropios_UsuarioExistente() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setIdUsuario(1);
        usuario.setCorreo("test@example.com");
        usuario.setNombre("Test User");

        Mockito.when(usuarioService.buscarPorCorreo("test@example.com"))
                .thenReturn(Optional.of(usuario));

        mockMvc.perform(get("/api/usuarios/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.correo").value("test@example.com"))
                .andExpect(jsonPath("$.nombre").value("Test User"));
    }

    @Test
    @WithMockUser(username = "noexiste@example.com")
    void obtenerDatosPropios_UsuarioNoExistente() throws Exception {
        Mockito.when(usuarioService.buscarPorCorreo("noexiste@example.com"))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/usuarios/me"))
                .andExpect(status().isNotFound());
    }
}
