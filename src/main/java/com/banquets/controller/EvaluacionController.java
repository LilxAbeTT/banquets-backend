package com.banquets.controller;

import com.banquets.dto.EvaluacionDTO;
import com.banquets.security.UserDetailsImpl;
import com.banquets.service.EvaluacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/evaluaciones")
public class EvaluacionController {

    @Autowired
    private EvaluacionService evaluacionService;

    @PostMapping
    @PreAuthorize("hasRole('ORGANIZACION')")
    public ResponseEntity<?> crearEvaluacion(
            Authentication auth,
            @RequestBody EvaluacionDTO dto) {

        UserDetailsImpl user = (UserDetailsImpl) auth.getPrincipal();
        Integer idOrganizacion = user.getId();

        try {
            evaluacionService.evaluar(dto, idOrganizacion);
            return ResponseEntity.ok("Evaluación registrada correctamente.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
