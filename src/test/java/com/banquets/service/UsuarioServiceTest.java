package com.banquets.service;

import com.banquets.entity.Usuario;
import com.banquets.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setCorreo("test@example.com");
        usuario.setContrasena("password");
        usuario.setNombre("Test User");
    }

    @Test
    void registrarUsuario_Correcto() {
        when(usuarioRepository.findByCorreo(usuario.getCorreo())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(usuario.getContrasena())).thenReturn("hashedPassword");
        when(usuarioRepository.save(any())).thenReturn(usuario);

        Usuario resultado = usuarioService.registrarUsuario(usuario);

        assertNotNull(resultado);
        verify(usuarioRepository).save(any());
        assertEquals("hashedPassword", resultado.getContrasena());
    }

    @Test
    void registrarUsuario_CorreoExistente() {
        when(usuarioRepository.findByCorreo(usuario.getCorreo())).thenReturn(Optional.of(usuario));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            usuarioService.registrarUsuario(usuario);
        });

        assertEquals("Correo ya registrado", exception.getMessage());
    }
}
