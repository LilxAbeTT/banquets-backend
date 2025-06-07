package com.banquets.config;

import com.banquets.security.JwtAuthenticationFilter;
import com.banquets.security.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// No necesitamos WebSecurityCustomizer si vamos a usar requestMatchers().permitAll() en la cadena directamente.
// Si webSecurityCustomizer() no funcionó, lo eliminamos para no causar confusiones.
// import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsServiceImpl userDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, UserDetailsServiceImpl userDetailsService) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userDetailsService = userDetailsService;
    }

    // Eliminamos el bean WebSecurityCustomizer por ahora para simplificar.
    // Si aún persiste el problema, es posible que el filtro JwtAuthenticationFilter
    // se esté ejecutando en rutas que deberían ser públicas antes de que el
    // permitAll() pueda actuar.

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(authorize -> authorize
                        // Accesos públicos (login y registro)
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/solicitudes/registro").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/api/solicitudes/registro").permitAll()

                        // Páginas públicas frontend
                        .requestMatchers(HttpMethod.GET, "/saber-mas", "/recuperar-password", "/").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/saber-mas", "/recuperar-password", "/").permitAll()

                        // Rutas API para recuperación de contraseña
                        .requestMatchers(HttpMethod.POST, "/api/usuarios/recuperar-contrasena").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/usuarios/restablecer-contrasena").permitAll()

                        // TODO: Agrega otras rutas públicas si las tienes aquí

                        // Todo lo demás requiere autenticación
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
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

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // Bean para la configuración de CORS, utilizado por http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOrigins(List.of("http://localhost:5173")); // Tu URL de frontend
        corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        corsConfig.setAllowedHeaders(List.of("*")); // Permite todas las cabeceras
        corsConfig.setAllowCredentials(true);
        corsConfig.setMaxAge(3600L); // Caché preflight request por 1 hora

        source.registerCorsConfiguration("/**", corsConfig); // Aplica a TODAS las rutas
        return source;
    }
}