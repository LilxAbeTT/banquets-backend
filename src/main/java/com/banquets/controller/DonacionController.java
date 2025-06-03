package com.banquets.controller;

import com.banquets.entity.Donacion;
import com.banquets.security.UserDetailsImpl;
import com.banquets.service.DonacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donaciones")
public class DonacionController {

    @Autowired
    private DonacionService donacionService;

    // Crear donación (solo DONADOR)
    @PostMapping
    public ResponseEntity<Donacion> crearDonacion(Authentication auth, @RequestBody Donacion donacion) {
        // Asumimos que donacion.donador ya tiene el ID usuario seteado en el frontend o backend
        return ResponseEntity.ok(donacionService.crearDonacion(donacion));
    }

    // Listar donaciones propias (DONADOR)
    @GetMapping("/mias")
    public ResponseEntity<List<Donacion>> listarDonacionesPropias(Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        Integer idDonador = userDetails.getId();
        List<Donacion> lista = donacionService.obtenerPorDonadorYEstado(idDonador, "pendientes");
        return ResponseEntity.ok(lista);
    }


    // Actualizar estado (por ejemplo, cuando Organización acepta)
    @PutMapping("/{id}/estado")
    public ResponseEntity<Donacion> actualizarEstado(@PathVariable Integer id, @RequestParam String estado) {
        Donacion actualizada = donacionService.actualizarEstado(id, estado);
        return ResponseEntity.ok(actualizada);
    }
}
