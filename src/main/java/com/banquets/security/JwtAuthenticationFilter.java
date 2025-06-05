package com.banquets.security;

import com.banquets.entity.Usuario;
import com.banquets.repository.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
// Importa un logger (ej. de SLF4J, si usas Logback/Log4j2 en tu pom.xml)
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class); // <--- Añadir Logger

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

        // Loggear la URL de la petición para depuración
        logger.info("Procesando petición: {} {}", request.getMethod(), request.getRequestURI()); // <--- Log aquí

        // Excluir la ruta de login explícitamente dentro del filtro (una capa extra de seguridad)
        // Esto debería ser redundante si webSecurityCustomizer().ignoring() funciona,
        // pero es una buena depuración.
        if (request.getRequestURI().equals("/api/auth/login") && request.getMethod().equals(HttpMethod.POST.name())) {
            logger.info("Saltando JWT Filter para ruta de login.");
            chain.doFilter(request, response);
            return;
        }
        if (request.getRequestURI().equals("/api/solicitudes/registro") && request.getMethod().equals(HttpMethod.POST.name())) {
            logger.info("Saltando JWT Filter para ruta de registro.");
            chain.doFilter(request, response);
            return;
        }
        // Para solicitudes OPTIONS (preflight CORS)
        if (request.getMethod().equals(HttpMethod.OPTIONS.name())) {
            logger.info("Saltando JWT Filter para petición OPTIONS.");
            chain.doFilter(request, response);
            return;
        }


        // 1. Obtener el encabezado de autorización
        final String authHeader = request.getHeader("Authorization");

        // 2. Si no hay token o no es Bearer, continuar con la cadena de filtros sin autenticación
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("No JWT token found in Authorization header or not a Bearer token."); // <--- Log
            chain.doFilter(request, response);
            return;
        }

        // 3. Extraer el token
        final String token = authHeader.substring(7);
        logger.info("JWT Token encontrado: {}", token); // <--- Log

        // 4. Validar el token y obtener el correo del usuario
        try {
            if (!jwtUtil.isTokenValid(token)) {
                logger.warn("JWT Token inválido."); // <--- Log
                chain.doFilter(request, response);
                return;
            }
            final String correo = jwtUtil.getCorreoFromToken(token);
            logger.info("JWT Token válido para correo: {}", correo); // <--- Log

            // 5. Si el correo existe y no hay autenticación en el contexto de seguridad
            if (correo != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // 6. Cargar los detalles del usuario desde la base de datos
                Usuario usuario = usuarioRepository.findByCorreo(correo)
                        .orElse(null);

                if (usuario != null) {
                    logger.info("Usuario cargado desde DB para JWT: {}", usuario.getCorreo()); // <--- Log
                    // 7. Crear una instancia de tu UserDetailsImpl con el objeto Usuario
                    UserDetailsImpl userDetails = new UserDetailsImpl(usuario);

                    // 8. Crear y establecer el token de autenticación en el SecurityContextHolder
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    logger.info("Autenticación establecida para usuario: {}", correo); // <--- Log
                } else {
                    logger.warn("Usuario no encontrado en DB para correo del JWT: {}", correo); // <--- Log
                }
            }
        } catch (Exception e) {
            logger.error("Error durante la validación del JWT o autenticación: {}", e.getMessage(), e); // <--- Log de errores
            // Puedes decidir qué hacer aquí, por ejemplo, enviar un 401 Unauthorized
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }


        // 9. Continuar con la cadena de filtros
        chain.doFilter(request, response);
    }
}