package com.banquets.controller;

import com.banquets.dto.ConfirmarEntregaDTO;
import com.banquets.entity.Recoleccion;
import com.banquets.security.UserDetailsImpl;
import com.banquets.service.RecoleccionService;
import com.banquets.dto.DonacionResponseDTO.RecoleccionDTO;
import com.banquets.dto.AceptarDonacionRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority; // Importar
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger; // Importar Logger
import org.slf4j.LoggerFactory; // Importar LoggerFactory

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors; // Importar

@RestController
@RequestMapping("/api/recolecciones")
public class RecoleccionController {

    private static final Logger logger = LoggerFactory.getLogger(RecoleccionController.class); // <--- Añadir Logger

    @Autowired
    private RecoleccionService recoleccionService;

    // Crear recolección (aceptar donación)
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ORGANIZACION')")
    public ResponseEntity<?> crearRecoleccion( // <--- Retorno cambiado a ResponseEntity<?>
                                               @RequestBody AceptarDonacionRequestDTO request,
                                               Authentication auth
    ) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
            Integer idOrganizacion = userDetails.getId(); // El ID de la organización autenticada

            Recoleccion creada = recoleccionService.crearRecoleccionYActualizarDonacion(
                    request.getIdDonacion(),
                    idOrganizacion,
                    request.getFechaEstimadaRecoleccion() // Puede ser null
            );
            logger.info("Recolección creada exitosamente para donación {}. Estado: {}", request.getIdDonacion(), creada.getEstado());
            // Si la recolección contiene relaciones LAZY, devolver un DTO.
            // Para simplicidad, podemos devolver un objeto con los IDs confirmados.
            // O un DTO cargado si recoleccionService.crearRecoleccionYActualizarDonacion devuelve un DTO.
            return ResponseEntity.ok("Donación aceptada y recolección creada."); // <--- Devolver un mensaje simple de éxito
            // Alternativa: Si RecoleccionService devolviera RecoleccionDTO, se devolvería el DTO aquí.
            // return ResponseEntity.ok(new RecoleccionDTO(creada)); // Si RecoleccionDTO tiene constructor de Entidad
        } catch (RuntimeException e) {
            logger.error("Error de negocio al aceptar donación: {}", e.getMessage(), e);
            // Devuelve 400 Bad Request con el mensaje de la excepción
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error inesperado al crear recolección: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor.");
        }
    }

    // Listar recolecciones por organización o donador (parametrizado)
    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_DONADOR', 'ROLE_ORGANIZACION', 'ROLE_ADMIN')")
    public ResponseEntity<List<RecoleccionDTO>> listarRecolecciones(Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        Integer idUsuario = userDetails.getId();
        String tipoUsuario = userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
        List<RecoleccionDTO> lista = recoleccionService.obtenerPorUsuario(idUsuario, tipoUsuario);
        return ResponseEntity.ok(lista);
    }

    // Listar recolecciones de donaciones de un donador específico (para su historial)
    @GetMapping("/donador/{idDonador}")
    @PreAuthorize("hasAnyAuthority('ROLE_DONADOR', 'ROLE_ADMIN')")
    public ResponseEntity<List<RecoleccionDTO>> listarRecoleccionesPorDonador(
            @PathVariable Integer idDonador,
            Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        if (!userDetails.getId().equals(idDonador) && !userDetails.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<RecoleccionDTO> lista = recoleccionService.obtenerPorDonador(idDonador);
        return ResponseEntity.ok(lista);
    }

    // Endpoint para confirmar entrega de una recolección y subir la firma
    @PutMapping("/{idRecoleccion}/confirmar")
    @PreAuthorize("hasAuthority('ROLE_DONADOR')")
    public ResponseEntity<Recoleccion> confirmarEntrega( // Se mantiene retorno de entidad si no da LazyInit
                                                         @PathVariable Integer idRecoleccion,
                                                         @RequestBody String firmaBase64,
                                                         Authentication auth
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        Integer idDonadorAutenticado = userDetails.getId();
        String tipoUsuario = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).filter(role -> role.startsWith("ROLE_")).findFirst().orElse("").replace("ROLE_", "");

        Recoleccion recoleccionActualizada = recoleccionService.confirmarRecoleccion(idRecoleccion, firmaBase64, idDonadorAutenticado, tipoUsuario);
        return ResponseEntity.ok(recoleccionActualizada);
    }

    // Endpoint para subir comprobante de imagen (para Organizacion)
    @PutMapping("/{idRecoleccion}/subirComprobante")
    @PreAuthorize("hasAuthority('ROLE_ORGANIZACION')")
    public ResponseEntity<Recoleccion> subirComprobante( // Se mantiene retorno de entidad si no da LazyInit
                                                         @PathVariable Integer idRecoleccion,
                                                         @RequestParam("comprobante") MultipartFile comprobanteFile,
                                                         Authentication auth
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        Integer idOrganizacionAutenticada = userDetails.getId();

        try {
            Recoleccion actualizada = recoleccionService.subirComprobante(idRecoleccion, comprobanteFile.getBytes(), idOrganizacionAutenticada);
            return ResponseEntity.ok(actualizada);
        } catch (IOException e) {
            logger.error("Error al procesar imagen para comprobante: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        } catch (RuntimeException e) { // Capturar errores de negocio del servicio
            logger.error("Error de negocio al subir comprobante: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // O un DTO de error
        } catch (Exception e) {
            logger.error("Error inesperado al subir comprobante: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/confirmar-entrega")
    public ResponseEntity<?> confirmarEntrega(@RequestBody ConfirmarEntregaDTO dto) {
        try {
            recoleccionService.confirmarEntrega(dto);
            return ResponseEntity.ok("Entrega confirmada exitosamente.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

}