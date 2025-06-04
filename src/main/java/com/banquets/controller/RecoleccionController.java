// src/main/java/com/banquets/controller/RecoleccionController.java
package com.banquets.controller;

import com.banquets.entity.Recoleccion;
import com.banquets.security.UserDetailsImpl;
import com.banquets.service.RecoleccionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    // NUEVO: Listar recolecciones de donaciones de un donador específico (para su historial)
    @GetMapping("/donador/{idDonador}")
    public ResponseEntity<List<Recoleccion>> listarRecoleccionesPorDonador(
            @PathVariable Integer idDonador,
            Authentication auth) {
        // Opcional: Verificar que el idDonador del path coincida con el id del usuario autenticado
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        if (!userDetails.getId().equals(idDonador)) {
            // Podrías lanzar una excepción o retornar 403 Forbidden
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<Recoleccion> lista = recoleccionService.obtenerPorDonador(idDonador);
        // Filtrar aquí si solo quieres las 'confirmadas' o 'recolectadas' para el historial
        // lista = lista.stream().filter(r -> "confirmada".equalsIgnoreCase(r.getEstado())).collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    // NUEVO: Endpoint para confirmar entrega de una recolección y subir la firma
    // Asume que recibes un JSON con el Base64 de la firma
    @PutMapping("/{idRecoleccion}/confirmar")
    public ResponseEntity<Recoleccion> confirmarEntrega(
            @PathVariable Integer idRecoleccion,
            @RequestBody String firmaBase64) { // Recibe el String Base64 directamente o en un DTO
        // Aquí podrías validar que el usuario autenticado sea el donador de la donación asociada a la recolección
        // o la organización, dependiendo de quién confirma la entrega.
        Recoleccion recoleccionActualizada = recoleccionService.confirmarRecoleccionConFirma(idRecoleccion, firmaBase64);
        return ResponseEntity.ok(recoleccionActualizada);
    }
}