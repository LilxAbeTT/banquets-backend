package com.banquets.controller;

import com.banquets.entity.Notificacion;
import com.banquets.service.NotificacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionController {

    @Autowired
    private NotificacionService notificacionService;

    // Obtener notificaciones por usuario
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Notificacion>> obtenerPorUsuario(@PathVariable Integer idUsuario) {
        return ResponseEntity.ok(notificacionService.obtenerPorUsuario(idUsuario));
    }

    // Crear notificación
    @PostMapping
    public ResponseEntity<Notificacion> crearNotificacion(@RequestBody Notificacion notificacion) {
        return ResponseEntity.ok(notificacionService.crearNotificacion(notificacion));
    }
}
