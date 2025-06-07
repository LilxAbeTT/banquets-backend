package com.banquets.controller;

import com.banquets.security.UserDetailsImpl;
import com.banquets.service.NotificacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionController {

    @Autowired
    private NotificacionService notificacionService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> verMisNotificaciones(Authentication auth) {
        UserDetailsImpl user = (UserDetailsImpl) auth.getPrincipal();
        List<Map<String, Object>> lista = notificacionService.obtenerNotificacionesPorUsuario(user.getId());
        return ResponseEntity.ok(lista);
    }

    @PutMapping("/marcar-leida/{id}")
    public ResponseEntity<?> marcarLeida(@PathVariable("id") Integer id) {
        notificacionService.marcarComoLeida(id);
        return ResponseEntity.ok("Notificación marcada como leída.");
    }
}
