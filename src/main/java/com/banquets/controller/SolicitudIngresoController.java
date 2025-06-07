package com.banquets.controller;

import com.banquets.dto.RechazoDTO;
import com.banquets.dto.SolicitudIngresoDTO;
import com.banquets.entity.SolicitudIngreso;
import com.banquets.repository.SolicitudIngresoRepository;
import com.banquets.service.SolicitudIngresoService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
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

    @PutMapping("/aprobar/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> aprobar(@PathVariable Integer id, HttpServletRequest request) {
        try {
            SolicitudIngreso solicitud = solicitudIngresoService.aprobar(
                    id,
                    request.getRemoteAddr(),
                    request.getHeader("User-Agent")
            );
            return ResponseEntity.ok(solicitud);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/rechazar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rechazar(@RequestBody RechazoDTO dto, HttpServletRequest request) {
        try {
            SolicitudIngreso solicitud = solicitudIngresoService.rechazar(
                    dto.getIdSolicitud(),
                    dto.getMotivo(),
                    request.getRemoteAddr(),
                    request.getHeader("User-Agent")
            );
            return ResponseEntity.ok(solicitud);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Contar solicitudes pendientes (ADMIN)
    @GetMapping("/pendientes/count") // <--- AÑADIR ESTA LÍNEA
    @PreAuthorize("hasRole('ADMIN')")
    public int contarPendientes() {
        return solicitudIngresoService.listarPorEstado("pendiente").size();
    }
}