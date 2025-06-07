package com.banquets.controller;

import com.banquets.dto.LoginRequest;
import com.banquets.dto.LoginResponse;
import com.banquets.dto.RecuperacionRequest;
import com.banquets.service.AuthService;
import com.banquets.service.RecuperacionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private RecuperacionService recuperacionService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/recuperar-contrasena")
    public ResponseEntity<?> recuperarContrasena(@RequestBody RecuperacionRequest request) {
        try {
            recuperacionService.enviarNuevaContrasena(request.getCorreo());
            return ResponseEntity.ok("Se ha enviado una nueva contraseña a tu correo.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

}
