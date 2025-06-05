package com.banquets.controller;

import com.banquets.dto.SolicitudIngresoDTO;
import com.banquets.entity.SolicitudIngreso;
import com.banquets.repository.SolicitudIngresoRepository;
import com.banquets.service.SolicitudIngresoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // <--- AÑADIR ESTA LÍNEA
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudIngresoController {

    private final SolicitudIngresoService solicitudIngresoService;
    private final SolicitudIngresoRepository solicitudIngresoRepository; // Si aún la usas aquí, sino remueve

    public SolicitudIngresoController(SolicitudIngresoService solicitudIngresoService, SolicitudIngresoRepository solicitudIngresoRepository) {
        this.solicitudIngresoService = solicitudIngresoService;
        this.solicitudIngresoRepository = solicitudIngresoRepository;
    }

    // Crear solicitud (público) - Esta ruta ya está permitida en SecurityConfig
    @PostMapping("/registro")
    public ResponseEntity<?> crearSolicitud(@RequestBody SolicitudIngresoDTO dto) {
        SolicitudIngreso sol = solicitudIngresoService.crearDesdeDTO(dto);
        return ResponseEntity.ok(sol);
    }

    // Actualizar estado de solicitud (ADMIN)
    @PutMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMIN')") // <--- AÑADIR ESTA LÍNEA
    public ResponseEntity<?> actualizarEstado(@PathVariable Integer id, @RequestParam String estado) {
        SolicitudIngreso sol = solicitudIngresoService.actualizarEstado(id, estado);
        return ResponseEntity.ok(sol);
    }

    // Listar solicitudes por estado (ADMIN)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')") // <--- AÑADIR ESTA LÍNEA
    public ResponseEntity<List<SolicitudIngreso>> listarPorEstado(@RequestParam String estado) {
        List<SolicitudIngreso> lista = solicitudIngresoService.listarPorEstado(estado);
        return ResponseEntity.ok(lista);
    }

    // Aprobar solicitud (ADMIN) - Si estos métodos están aquí después de la consolidación
    @PutMapping("/aprobar/{id}")
    @PreAuthorize("hasRole('ADMIN')") // <--- AÑADIR ESTA LÍNEA
    public SolicitudIngreso aprobar(@PathVariable Integer id) {
        return solicitudIngresoService.aprobar(id);
    }

    // Rechazar solicitud (ADMIN) - Si estos métodos están aquí después de la consolidación
    @PutMapping("/rechazar/{id}")
    @PreAuthorize("hasRole('ADMIN')") // <--- AÑADIR ESTA LÍNEA
    public SolicitudIngreso rechazar(@PathVariable Integer id) {
        return solicitudIngresoService.rechazar(id);
    }

    // Contar solicitudes pendientes (ADMIN)
    @GetMapping("/pendientes/count") // <--- AÑADIR ESTA LÍNEA
    @PreAuthorize("hasRole('ADMIN')")
    public int contarPendientes() {
        return solicitudIngresoService.listarPorEstado("pendiente").size();
    }
}