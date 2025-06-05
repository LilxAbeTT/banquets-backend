package com.banquets.controller;

import com.banquets.entity.Recoleccion;
import com.banquets.security.UserDetailsImpl;
import com.banquets.service.RecoleccionService;
import com.banquets.dto.DonacionResponseDTO.RecoleccionDTO; // Importa el DTO de recolección
import com.banquets.dto.AceptarDonacionRequestDTO; // <--- Importa el nuevo DTO
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger; // <--- Importar Logger
import org.slf4j.LoggerFactory; // <--- Importar LoggerFactory
import org.springframework.security.core.GrantedAuthority; // <--- AÑADIR ESTA LÍNEA


import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/recolecciones")
public class RecoleccionController {

    private static final Logger logger = LoggerFactory.getLogger(RecoleccionController.class); // <--- Añadir Logger

    @Autowired
    private RecoleccionService recoleccionService;

    // Crear recolección (aceptar donación)
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ORGANIZACION')")
    public ResponseEntity<Recoleccion> crearRecoleccion( // <--- Se mantiene Recoleccion en el retorno por ahora
                                                         @RequestBody AceptarDonacionRequestDTO request, // <--- Recibe el DTO de solicitud
                                                         Authentication auth // Para obtener el ID de la organización
    ) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
            Integer idOrganizacion = userDetails.getId(); // El ID de la organización autenticada

            Recoleccion creada = recoleccionService.crearRecoleccionYActualizarDonacion(
                    request.getIdDonacion(),
                    idOrganizacion,
                    request.getFechaEstimadaRecoleccion() // Puede ser null si no se especifica
            );
            return ResponseEntity.ok(creada);
        } catch (RuntimeException e) {
            logger.error("Error al aceptar donación: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // O un DTO de error con el mensaje
        } catch (Exception e) {
            logger.error("Error inesperado al aceptar donación: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
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

    // Listar recolecciones de donaciones de un donador específico (para su historial) - Podría ser redundante con el GET general
    @GetMapping("/donador/{idDonador}")
    @PreAuthorize("hasAuthority('ROLE_DONADOR') or hasAuthority('ROLE_ADMIN')")
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
    public ResponseEntity<Recoleccion> confirmarEntrega(
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
    public ResponseEntity<Recoleccion> subirComprobante(
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
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}