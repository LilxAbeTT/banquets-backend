package com.banquets.controller;

import com.banquets.entity.Recoleccion;
import com.banquets.security.UserDetailsImpl;
import com.banquets.service.RecoleccionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recolecciones")
public class RecoleccionController {

    @Autowired
    private RecoleccionService recoleccionService;

    // Crear recolección (aceptar donación)
    @PostMapping
    public ResponseEntity<Recoleccion> crearRecoleccion(@RequestBody Recoleccion recoleccion) {
        Recoleccion creada = recoleccionService.crearRecoleccion(recoleccion);
        return ResponseEntity.ok(creada);
    }

    // Listar recolecciones por organización o donador (parametrizado)
    @GetMapping
    public ResponseEntity<List<Recoleccion>> listarRecolecciones(Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        Integer idUsuario = userDetails.getId();
        String tipoUsuario = userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
        List<Recoleccion> lista = recoleccionService.obtenerPorUsuario(idUsuario, tipoUsuario);
        return ResponseEntity.ok(lista);
    }

}
