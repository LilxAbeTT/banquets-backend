package com.banquets.controller;

import com.banquets.entity.Notificacion;
import com.banquets.service.NotificacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionController {

    @Autowired
    private NotificacionService notificacionService;

    // Obtener notificaciones por usuario
    @GetMapping("/usuario/{idUsuario}")
    @PreAuthorize("hasRole('ADMIN') or (#idUsuario == authentication.principal.id)")
    public ResponseEntity<List<Notificacion>> obtenerPorUsuario(@PathVariable Integer idUsuario) {
        return ResponseEntity.ok(notificacionService.obtenerPorUsuario(idUsuario));
    }

    // Crear notificación
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Notificacion> crearNotificacion(@RequestBody Notificacion notificacion) {
        return ResponseEntity.ok(notificacionService.crearNotificacion(notificacion));
    }
}
