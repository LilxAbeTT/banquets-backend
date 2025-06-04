// src/main/java/com/banquets/controller/EvaluacionController.java
package com.banquets.controller;

import com.banquets.entity.Evaluacion;
import com.banquets.entity.Recoleccion; // Necesario para la entidad Recoleccion
import com.banquets.repository.RecoleccionRepository; // Necesario para buscar la Recoleccion
import com.banquets.security.UserDetailsImpl;
import com.banquets.service.EvaluacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evaluaciones")
public class EvaluacionController {

    @Autowired
    private EvaluacionService evaluacionService;

    @Autowired
    private RecoleccionRepository recoleccionRepository; // Inyecta el repositorio de recolección

    // Crear evaluación
    @PostMapping
    public ResponseEntity<Evaluacion> crearEvaluacion(
            Authentication auth, // Para obtener el ID del usuario que evalúa
            @RequestBody Evaluacion evaluacion) { // El frontend enviará un objeto Evaluacion
        // Antes de guardar, asegúrate de que la recolección asociada exista y que el usuario autenticado
        // sea el donador o la organización correcta para evaluar.
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        Integer idUsuarioEvaluador = userDetails.getId();

        // Puedes añadir validaciones adicionales aquí, por ejemplo:
        // 1. Que la recolección exista y esté en estado 'confirmada'.
        // 2. Que el usuario autenticado (idUsuarioEvaluador) sea el donador asociado a esa recolección.
        //    Esto requeriría buscar la recolección y verificar su donador.
        Recoleccion recoleccion = recoleccionRepository.findById(evaluacion.getRecoleccion().getIdRecoleccion())
                .orElseThrow(() -> new RuntimeException("Recolección no encontrada para la evaluación."));

        // Ejemplo de validación de propiedad (descomentar y adaptar si necesitas)
        // if (!recoleccion.getDonacion().getDonador().getIdDonador().equals(idUsuarioEvaluador)) {
        //     throw new RuntimeException("Solo el donador asociado puede evaluar esta recolección.");
        // }

        // Asegúrate de que el objeto Recoleccion dentro de evaluacion esté completamente mapeado
        evaluacion.setRecoleccion(recoleccion); // Asigna el objeto Recoleccion gestionado por JPA

        return ResponseEntity.ok(evaluacionService.crearEvaluacion(evaluacion));
    }

    // Listar evaluaciones por usuario
    @GetMapping
    public ResponseEntity<List<Evaluacion>> listarEvaluaciones(Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        Integer idUsuario = userDetails.getId();
        String tipoUsuario = userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
        List<Evaluacion> lista;
        if ("DONADOR".equalsIgnoreCase(tipoUsuario)) {
            lista = evaluacionService.obtenerPorDonador(idUsuario);
        } else { // Asumimos ORGANIZACION o ADMIN
            lista = evaluacionService.obtenerPorOrganizacion(idUsuario);
        }
        return ResponseEntity.ok(lista);
    }
}