package com.banquets.security;

import com.banquets.entity.Usuario;
import com.banquets.repository.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UsuarioRepository usuarioRepository;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UsuarioRepository usuarioRepository) {
        this.jwtUtil = jwtUtil;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        // 1. Obtener el encabezado de autorización
        final String authHeader = request.getHeader("Authorization");

        // 2. Si no hay token o no es Bearer, continuar con la cadena de filtros sin autenticación
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        // 3. Extraer el token
        final String token = authHeader.substring(7);

        // 4. Validar el token y obtener el correo del usuario
        // Asegúrate de que isTokenValid y getCorreoFromToken no lancen excepciones aquí que no sean atrapadas
        // (Aunque tu JwtUtil ya tiene try-catch para JwtException)
        if (!jwtUtil.isTokenValid(token)) {
            chain.doFilter(request, response);
            return;
        }
        final String correo = jwtUtil.getCorreoFromToken(token);

        // 5. Si el correo existe y no hay autenticación en el contexto de seguridad
        if (correo != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // 6. Cargar los detalles del usuario desde la base de datos
            // Usamos findByCorreo para obtener la entidad Usuario
            Usuario usuario = usuarioRepository.findByCorreo(correo)
                    .orElse(null); // Usar orElse(null) es seguro aquí para no detener el filtro

            if (usuario != null) {
                // 7. Crear una instancia de tu UserDetailsImpl con el objeto Usuario
                // UserDetailsImpl es quien sabe cómo convertir el tipoUsuario a ROLE_TIPOUSUARIO
                UserDetailsImpl userDetails = new UserDetailsImpl(usuario);

                // 8. Crear y establecer el token de autenticación en el SecurityContextHolder
                // ESENCIAL: Pasar userDetails como principal y sus getAuthorities() para los roles
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,                           // Principal: El objeto UserDetailsImpl
                        null,                                  // Credentials: No se necesitan aquí
                        userDetails.getAuthorities()           // Authorities: Los roles reales del usuario
                );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authToken); // Establecer la autenticación
            }
        }

        // 9. Continuar con la cadena de filtros
        chain.doFilter(request, response);
    }
}