// src/main/java/com/banquets/controller/DonacionController.java
package com.banquets.controller;

import com.banquets.entity.Donacion;
import com.banquets.entity.Donador;
import com.banquets.security.UserDetailsImpl;
import com.banquets.service.DonacionService;
import com.banquets.repository.DonadorRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/donaciones")
public class DonacionController {

    @Autowired
    private DonacionService donacionService;

    @Autowired
    private DonadorRepository donadorRepository;

    // Crear donación (solo DONADOR)
    @PostMapping
    public ResponseEntity<Donacion> crearDonacion(
            Authentication auth,
            @RequestParam("titulo") String titulo,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("fechaLimite") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaLimite,
            @RequestParam("latitud") Double latitud,
            @RequestParam("longitud") Double longitud,
            @RequestParam("tipo") String tipo,
            @RequestParam("categoria") String categoria,
            @RequestParam("cantidad") Integer cantidad,
            @RequestParam("empacado") Boolean empacado,
            @RequestParam("estadoComida") String estadoComida,
            @RequestParam(value = "imagen", required = false) MultipartFile imagenFile
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        Integer idDonador = userDetails.getId();

        Donador donador = donadorRepository.findById(idDonador)
                .orElseThrow(() -> new RuntimeException("Donador no encontrado con ID: " + idDonador));

        Donacion donacion = new Donacion();
        donacion.setDonador(donador);
        donacion.setTitulo(titulo);
        donacion.setDescripcion(descripcion);
        donacion.setFechaLimite(fechaLimite);
        donacion.setLatitud(latitud);
        donacion.setLongitud(longitud);
        donacion.setTipo(tipo);
        donacion.setCategoria(categoria);
        donacion.setCantidad(cantidad);
        donacion.setEmpacado(empacado);
        donacion.setEstadoComida(estadoComida);

        try {
            if (imagenFile != null && !imagenFile.isEmpty()) {
                donacion.setImagen(imagenFile.getBytes());
            }
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

        return ResponseEntity.ok(donacionService.crearDonacion(donacion));
    }

    // Listar donaciones propias (DONADOR)
    @GetMapping("/mias")
    public ResponseEntity<List<Donacion>> listarDonacionesPropias(Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        Integer idDonador = userDetails.getId();
        // Obtener donaciones que no estén 'recolectadas' para el muro
        List<Donacion> lista = donacionService.obtenerDonacionesActivasPorDonador(idDonador);
        return ResponseEntity.ok(lista);
    }

    // Actualizar estado (por ejemplo, cuando Organización acepta)
    @PutMapping("/{id}/estado")
    public ResponseEntity<Donacion> actualizarEstado(@PathVariable Integer id, @RequestParam String estado) {
        Donacion actualizada = donacionService.actualizarEstado(id, estado);
        return ResponseEntity.ok(actualizada);
    }

    // NUEVO: Eliminar donación (solo DONADOR puede eliminar las suyas y si están pendientes)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarDonacion(Authentication auth, @PathVariable Integer id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        Integer idDonador = userDetails.getId();
        donacionService.eliminarDonacion(id, idDonador);
        return ResponseEntity.noContent().build(); // Retorna 204 No Content en caso de éxito
    }
}