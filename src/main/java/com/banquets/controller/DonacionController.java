package com.banquets.controller;

import com.banquets.entity.Donacion;
import com.banquets.entity.Donador;
import com.banquets.security.UserDetailsImpl;
import com.banquets.service.DonacionService;
import com.banquets.repository.DonadorRepository;
import com.banquets.dto.DonacionResponseDTO; // <--- Importa el DTO

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

    // Crear donación (solo DONADOR) - Este método ya lo tienes y funciona con el frontend
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

    // Listar donaciones propias (DONADOR) - Ahora devuelve DTOs
    @GetMapping("/mias")
    public ResponseEntity<List<DonacionResponseDTO>> listarDonacionesPropias(Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        Integer idDonador = userDetails.getId();
        // Llama al servicio que ahora devuelve DTOs
        List<DonacionResponseDTO> lista = donacionService.obtenerPorDonadorYEstado(idDonador, "pendientes"); // Filtra por estado 'pendientes'
        return ResponseEntity.ok(lista);
    }

    // Endpoint para obtener todas las donaciones (útil para organización)
    @GetMapping
    public ResponseEntity<List<DonacionResponseDTO>> listarTodasLasDonaciones(@RequestParam(required = false) String estado) {
        List<DonacionResponseDTO> lista;
        if (estado != null && !estado.isEmpty()) {
            lista = donacionService.obtenerPorEstado(estado);
        } else {
            // Si no se especifica estado, obtén todas las que sean públicas o relevantes
            // Por ahora, solo las pendientes para el dashboard de organización
            lista = donacionService.obtenerPorEstado("pendientes");
        }
        return ResponseEntity.ok(lista);
    }


    // Actualizar estado (por ejemplo, cuando Organización acepta) - Permanece igual, opera sobre la entidad Donacion
    @PutMapping("/{id}/estado")
    public ResponseEntity<Donacion> actualizarEstado(@PathVariable Integer id, @RequestParam String estado) {
        Donacion actualizada = donacionService.actualizarEstado(id, estado);
        return ResponseEntity.ok(actualizada);
    }

    // Endpoint para eliminar donación
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarDonacion(@PathVariable Integer id, Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        Integer idDonador = userDetails.getId();
        // Opcional: Añadir validación para que solo el donador dueño o un admin pueda eliminar
        // Donacion donacion = donacionService.obtenerDonacionPorId(id); // Necesitarías un método para obtener la Donacion entidad
        // if (!donacion.getDonador().getIdDonador().equals(idDonador) && !userDetails.getTipoUsuario().equals("ADMIN")) {
        //     return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        // }
        donacionService.eliminarDonacion(id);
        return ResponseEntity.noContent().build(); // 204 No Content para eliminación exitosa
    }
}