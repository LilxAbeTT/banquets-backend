package com.banquets.service.impl;

import com.banquets.dto.LoginRequest;
import com.banquets.dto.LoginResponse;
import com.banquets.entity.Usuario;
import com.banquets.repository.UsuarioRepository;
import com.banquets.security.JwtUtil;
import com.banquets.service.AuthService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthServiceImpl(UsuarioRepository usuarioRepository,
                           JwtUtil jwtUtil,
                           BCryptPasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.getContrasena(), usuario.getContrasena())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        String token = jwtUtil.generateToken(usuario.getCorreo(), usuario.getTipoUsuario());

        return new LoginResponse(token, usuario.getTipoUsuario(), usuario.getNombre());
    }
}
