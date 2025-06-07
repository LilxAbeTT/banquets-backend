package com.banquets.controller;

import com.banquets.dto.CancelarDonacionDTO;
import com.banquets.dto.EditarDonacionDTO;
import com.banquets.dto.ImagenDonacionDTO;
import com.banquets.entity.Donacion;
import com.banquets.entity.Donador;
import com.banquets.security.UserDetailsImpl;
import com.banquets.service.DonacionService;
import com.banquets.repository.DonadorRepository;
import com.banquets.dto.DonacionResponseDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/donaciones")
public class DonacionController {

    private static final Logger logger = LoggerFactory.getLogger(DonacionController.class);

    @Autowired
    private DonacionService donacionService;

    @Autowired
    private DonadorRepository donadorRepository;

    // Crear donación (solo DONADOR)
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_DONADOR')")
    public ResponseEntity<DonacionResponseDTO> crearDonacion( // <--- CAMBIO CLAVE: Devuelve DTO
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
        try {
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

            if (imagenFile != null && !imagenFile.isEmpty()) {
                donacion.setImagen(imagenFile.getBytes());
            }

            // Llama al nuevo método del servicio que guarda y devuelve un DTO cargado
            DonacionResponseDTO nuevaDonacionDTO = donacionService.crearDonacionAndReturnDTO(donacion);
            return ResponseEntity.ok(nuevaDonacionDTO); // <--- Devolver el DTO
        } catch (IOException e) {
            logger.error("Error al procesar imagen para donación: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // O un DTO de error
        } catch (RuntimeException e) {
            logger.error("Error al crear donación: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // O un DTO de error con el mensaje
        } catch (Exception e) {
            logger.error("Error inesperado al crear donación: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // O un DTO de error
        }
    }

    // ... (resto del controlador)
    @GetMapping("/mias")
    @PreAuthorize("hasAuthority('ROLE_DONADOR')")
    public ResponseEntity<List<DonacionResponseDTO>> listarDonacionesPropias(Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        Integer idDonador = userDetails.getId();
        List<DonacionResponseDTO> lista = donacionService.obtenerDonacionesPropiasParaDashboard(idDonador);
        return ResponseEntity.ok(lista);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ORGANIZACION')")
    public ResponseEntity<List<DonacionResponseDTO>> listarTodasLasDonaciones(@RequestParam(required = false) String estado) {
        List<DonacionResponseDTO> lista;
        if (estado != null && !estado.isEmpty()) {
            lista = donacionService.obtenerPorEstado(estado);
        } else {
            lista = donacionService.obtenerPorEstado("pendientes");
        }
        return ResponseEntity.ok(lista);
    }

    @PutMapping("/{id}/estado")
    @PreAuthorize("hasAnyAuthority('ROLE_ORGANIZACION', 'ROLE_DONADOR', 'ROLE_ADMIN')")
    public ResponseEntity<Donacion> actualizarEstado(@PathVariable Integer id, @RequestParam String estado) {
        Donacion actualizada = donacionService.actualizarEstado(id, estado);
        return ResponseEntity.ok(actualizada);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_DONADOR', 'ROLE_ADMIN')")
    public ResponseEntity<Void> eliminarDonacion(@PathVariable Integer id, Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        Integer idUsuarioAutenticado = userDetails.getId();
        String tipoUsuario = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(role -> role.startsWith("ROLE_"))
                .findFirst()
                .orElse("").replace("ROLE_", "");

        donacionService.eliminarDonacion(id, idUsuarioAutenticado, tipoUsuario);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/editar")
    public ResponseEntity<?> editarDonacion(@RequestBody EditarDonacionDTO dto) {
        try {
            donacionService.actualizarDonacion(dto);
            return ResponseEntity.ok("Donación actualizada correctamente.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/cancelar")
    public ResponseEntity<?> cancelarDonacion(@RequestBody CancelarDonacionDTO dto) {
        try {
            donacionService.cancelarDonacion(dto.getIdDonacion());
            return ResponseEntity.ok("Donación cancelada.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/subir-imagen")
    @PreAuthorize("hasRole('DONADOR')")
    public ResponseEntity<?> subirImagenDonacion(@RequestBody ImagenDonacionDTO dto) {
        try {
            donacionService.subirImagenDonacion(dto);
            return ResponseEntity.ok("Imagen subida correctamente.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }


}