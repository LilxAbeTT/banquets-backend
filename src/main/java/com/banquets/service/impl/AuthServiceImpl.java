package com.banquets.service.impl;

import com.banquets.dto.LoginRequest;
import com.banquets.dto.LoginResponse;
import com.banquets.entity.Usuario;
import com.banquets.entity.Direccion;
import com.banquets.repository.UsuarioRepository;
import com.banquets.repository.DireccionRepository; // <--- Importa DireccionRepository si no lo tienes ya
import com.banquets.security.JwtUtil;
import com.banquets.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepository;
    // DireccionRepository ya no es estrictamente necesario inyectarlo aquí si usamos JOIN FETCH en UsuarioRepository
    // private final DireccionRepository direccionRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(UsuarioRepository usuarioRepository,
                           // DireccionRepository direccionRepository, // Si la inyección ya no es necesaria
                           JwtUtil jwtUtil,
                           PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        // this.direccionRepository = direccionRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        // Cargar el usuario Y sus direcciones en la misma consulta para evitar LazyInitializationException
        Usuario usuario = usuarioRepository.findByCorreoFetchDirecciones(request.getCorreo()) // <--- CAMBIO CLAVE AQUÍ
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.getContrasena(), usuario.getContrasena())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        String token = jwtUtil.generateToken(usuario.getCorreo(), usuario.getTipoUsuario());

        Double latitud = null;
        Double longitud = null;

        // Ahora, usuario.getDirecciones() debería estar cargado
        if (usuario.getDirecciones() != null && !usuario.getDirecciones().isEmpty()) {
            Direccion primeraDireccion = usuario.getDirecciones().get(0);
            latitud = primeraDireccion.getLatitud();
            longitud = primeraDireccion.getLongitud();
        }

        return new LoginResponse(token, usuario.getTipoUsuario(), usuario.getNombre(), usuario.getIdUsuario(), latitud, longitud);
    }
}