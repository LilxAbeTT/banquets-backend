package com.banquets.controller;

import com.banquets.dto.RespuestaSoporteDTO;
import com.banquets.security.UserDetailsImpl;
import com.banquets.service.SoporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/soporte")
public class SoporteController {

    @Autowired
    private SoporteService soporteService;

    @PutMapping("/responder")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> responderMensaje(
            @RequestBody RespuestaSoporteDTO dto,
            Authentication auth) {
        UserDetailsImpl user = (UserDetailsImpl) auth.getPrincipal();
        Integer idAdmin = user.getId();

        try {
            soporteService.responderMensaje(dto, idAdmin);
            return ResponseEntity.ok("Respuesta enviada correctamente.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
