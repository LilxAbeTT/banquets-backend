package com.banquets.security;
// En SecurityConfig.java

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource; // <-- Importar
import org.springframework.web.cors.UrlBasedCorsConfigurationSource; // <-- Importar

import java.util.List;

@Configuration
@EnableMethodSecurity // Ya lo tienes, pero es importante que esté para @PreAuthorize y para que funcione hasRole() correctamente
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsServiceImpl userDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, UserDetailsServiceImpl userDetailsService) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())

                .authorizeHttpRequests(authorize -> authorize
                        // Rutas públicas
                        .requestMatchers(
                                HttpMethod.POST, "/api/auth/login", "/api/solicitudes/registro"
                        ).permitAll()
                        .requestMatchers(
                                "/saber-mas", "/recuperar-password", "/"
                        ).permitAll()

                        // Rutas para ADMINISTRADORES
                        .requestMatchers(
                                "/api/usuarios/**",
                                "/api/solicitudes/**",
                                "/api/soporte/**",
                                "/api/configuracion/**"
                        ).hasRole("ADMIN")

                        // Rutas ESPECÍFICAS para DONADORES
                        .requestMatchers(HttpMethod.POST, "/api/donaciones").hasRole("DONADOR") // Crear donación
                        .requestMatchers(HttpMethod.GET, "/api/donaciones/mias").hasRole("DONADOR") // Ver sus donaciones
                        .requestMatchers(HttpMethod.PUT, "/api/donaciones/{id}/**").hasRole("DONADOR") // Actualizar/eliminar sus donaciones
                        .requestMatchers(HttpMethod.DELETE, "/api/donaciones/{id}").hasRole("DONADOR")

                        // Rutas para RECOLECCIONES (ajustado para DONADOR y ORGANIZACION)
                        // Si el endpoint /api/recolecciones (GET general) es para que ambos roles vean sus cosas:
                        // Y /api/recolecciones/{idRecoleccion}/confirmar es para que el DONADOR confirme
                        // Y el POST a /api/recolecciones es para que ORGANIZACION cree (acepte)
                        .requestMatchers(HttpMethod.GET, "/api/recolecciones").hasAnyRole("DONADOR", "ORGANIZACION") // Ambos roles pueden ver sus recolecciones
                        .requestMatchers(HttpMethod.PUT, "/api/recolecciones/{idRecoleccion}/confirmar").hasRole("DONADOR") // Donador confirma
                        .requestMatchers(HttpMethod.POST, "/api/recolecciones").hasRole("ORGANIZACION") // Organización acepta donación

                        // Rutas específicas para ORGANIZACIONES
                        .requestMatchers(HttpMethod.GET, "/api/donaciones").hasRole("ORGANIZACION") // Organización puede ver todas las donaciones pendientes
                        .requestMatchers(HttpMethod.PUT, "/api/donaciones/{id}/estado").hasRole("ORGANIZACION") // Organización actualiza estado de donación

                        // Rutas comunes (para todos los roles logueados)
                        .requestMatchers("/api/usuarios/me/**").authenticated()
                        .requestMatchers("/api/chat/**").hasAnyRole("DONADOR", "ORGANIZACION", "ADMIN")
                        .requestMatchers("/api/notificaciones/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/soporte").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/evaluaciones").authenticated() // Ambos donador/org pueden evaluar

                        // Cualquier otra solicitud requiere autenticación
                        .anyRequest().authenticated()
                );

        // ... (resto de la configuración: sessionManagement, authenticationProvider, addFilterBefore)
        http.sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // VUELVE A COLOCAR ESTE BEAN
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        var corsConfig = new org.springframework.web.cors.CorsConfiguration();
        corsConfig.setAllowedOrigins(List.of("http://localhost:5173"));
        corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        corsConfig.setAllowedHeaders(List.of("*"));
        corsConfig.setAllowCredentials(true);

        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}