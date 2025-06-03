package com.banquets.controller;

import com.banquets.entity.SolicitudIngreso;
import com.banquets.service.SolicitudIngresoService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudController {

    private final SolicitudIngresoService solicitudService;

    public SolicitudController(SolicitudIngresoService solicitudService) {
        this.solicitudService = solicitudService;
    }

    @GetMapping("/pendientes")
    public List<SolicitudIngreso> obtenerPendientes() {
        return solicitudService.listarPorEstado("pendiente");
    }

    @GetMapping("/pendientes/count")
    public int contarPendientes() {
        return solicitudService.listarPorEstado("pendiente").size();
    }

    @PutMapping("/aprobar/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public SolicitudIngreso aprobar(@PathVariable Integer id) {
        return solicitudService.aprobar(id);
    }

    @PutMapping("/rechazar/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public SolicitudIngreso rechazar(@PathVariable Integer id) {
        return solicitudService.rechazar(id);
    }

}
