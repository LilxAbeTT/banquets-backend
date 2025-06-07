package com.banquets.controller;

import com.banquets.service.BitacoraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/bitacora")
@PreAuthorize("hasRole('ADMIN')")
public class BitacoraController {

    @Autowired
    private BitacoraService bitacoraService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> obtenerBitacora() {
        return ResponseEntity.ok(bitacoraService.consultarBitacora());
    }

    // Utilidad opcional para registrar desde frontend (si no está cubierto por SPs)
    @PostMapping("/registrar")
    public ResponseEntity<?> registrarBitacoraManual(
            @RequestParam Integer idUsuario,
            @RequestParam String tipo,
            @RequestParam String modulo,
            @RequestParam(required = false) Integer idEntidad,
            @RequestParam String descripcion,
            HttpServletRequest request) {

        String ip = request.getRemoteAddr();
        String agente = request.getHeader("User-Agent");

        bitacoraService.registrarEvento(idUsuario, tipo, modulo, idEntidad, descripcion, ip, agente);
        return ResponseEntity.ok("Bitácora registrada manualmente.");
    }
}
