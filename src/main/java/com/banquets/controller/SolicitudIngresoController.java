package com.banquets.controller;

import com.banquets.dto.SolicitudIngresoDTO;
import com.banquets.entity.SolicitudIngreso;
import com.banquets.repository.SolicitudIngresoRepository;
import com.banquets.service.SolicitudIngresoService;
import com.banquets.service.impl.SolicitudIngresoServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudIngresoController {

    private final SolicitudIngresoService solicitudIngresoService;
    private final SolicitudIngresoRepository solicitudIngresoRepository;
    public SolicitudIngresoController(SolicitudIngresoService solicitudIngresoService, SolicitudIngresoRepository solicitudIngresoRepository) {
        this.solicitudIngresoService = solicitudIngresoService;
        this.solicitudIngresoRepository = solicitudIngresoRepository;
    }


    @PostMapping("/registro")
    public ResponseEntity<?> crearSolicitud(@RequestBody SolicitudIngresoDTO dto) {
        SolicitudIngreso sol = solicitudIngresoService.crearDesdeDTO(dto);
        return ResponseEntity.ok(sol);
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(@PathVariable Integer id, @RequestParam String estado) {
        SolicitudIngreso sol = solicitudIngresoService.actualizarEstado(id, estado);
        return ResponseEntity.ok(sol);
    }

    @GetMapping
    public ResponseEntity<List<SolicitudIngreso>> listarPorEstado(@RequestParam String estado) {
        List<SolicitudIngreso> lista = solicitudIngresoService.listarPorEstado(estado);
        return ResponseEntity.ok(lista);
    }


}
