package com.banquets.controller;

import com.banquets.entity.Evaluacion;
import com.banquets.security.UserDetailsImpl;
import com.banquets.service.EvaluacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evaluaciones")
public class EvaluacionController {

    @Autowired
    private EvaluacionService evaluacionService;

    // Crear evaluación
    @PostMapping
    public ResponseEntity<Evaluacion> crearEvaluacion(@RequestBody Evaluacion evaluacion) {
        return ResponseEntity.ok(evaluacionService.crearEvaluacion(evaluacion));
    }

    // Listar evaluaciones por usuario
    @GetMapping
    public ResponseEntity<List<Evaluacion>> listarEvaluaciones(Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        Integer idUsuario = userDetails.getId();
        String tipoUsuario = userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
        List<Evaluacion> lista;
        if ("DONADOR".equalsIgnoreCase(tipoUsuario)) {
            lista = evaluacionService.obtenerPorDonador(idUsuario);
        } else {
            lista = evaluacionService.obtenerPorOrganizacion(idUsuario);
        }
        return ResponseEntity.ok(lista);
    }

}
