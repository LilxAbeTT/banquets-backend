package com.banquets.controller;

import com.banquets.entity.MensajeSoporte;
import com.banquets.service.MensajeSoporteService;
import com.banquets.repository.MensajeSoporteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/soporte")
public class MensajeSoporteController {

    @Autowired
    private MensajeSoporteService mensajeSoporteService;

    @Autowired
    private MensajeSoporteRepository mensajeSoporteRepository;

    // Enviar mensaje soporte
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MensajeSoporte> enviarMensaje(@RequestBody MensajeSoporte mensaje) {
        return ResponseEntity.ok(mensajeSoporteService.crearMensaje(mensaje));
    }

    // Listar mensajes pendientes (solo ADMIN)
    @GetMapping("/pendientes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MensajeSoporte>> listarPendientes() {
        return ResponseEntity.ok(mensajeSoporteService.listarPendientes());
    }

    // Marcar mensaje respondido (solo ADMIN)
    @PutMapping("/{id}/respondido")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MensajeSoporte> marcarRespondido(@PathVariable Integer id) {
        return ResponseEntity.ok(mensajeSoporteService.marcarRespondido(id));
    }

    // NUEVO: Contar mensajes pendientes
    @GetMapping("/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> contarPendientes() {
        long total = mensajeSoporteRepository.countByEstado("pendiente");
        return ResponseEntity.ok(total);
    }
}
