// src/main/java/com/banquets/service/RecoleccionService.java
package com.banquets.service;

import com.banquets.entity.Recoleccion;
import com.banquets.repository.RecoleccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RecoleccionService {

    @Autowired
    private RecoleccionRepository recoleccionRepository;

    public Recoleccion crearRecoleccion(Recoleccion recoleccion) {
        // Aquí podrías añadir lógica para actualizar el estado de la Donacion a 'en_proceso'
        return recoleccionRepository.save(recoleccion);
    }

    public Recoleccion actualizarRecoleccion(Recoleccion recoleccion) {
        return recoleccionRepository.save(recoleccion);
    }

    public List<Recoleccion> obtenerPorOrganizacion(Integer idOrganizacion) {
        return recoleccionRepository.findByOrganizacionIdOrganizacion(idOrganizacion);
    }

    public List<Recoleccion> obtenerPorDonador(Integer idDonador) {
        // En este método obtendrás todas las recolecciones donde la donación fue hecha por ese donador
        return recoleccionRepository.findByDonacionDonadorIdDonador(idDonador);
    }

    public List<Recoleccion> obtenerPorUsuario(Integer idUsuario, String tipoUsuario) {
        if ("DONADOR".equalsIgnoreCase(tipoUsuario)) {
            return recoleccionRepository.findByDonacionDonadorIdDonador(idUsuario);
        } else if ("ORGANIZACION".equalsIgnoreCase(tipoUsuario)) {
            return recoleccionRepository.findByOrganizacionIdOrganizacion(idUsuario);
        } else {
            throw new IllegalArgumentException("Tipo de usuario inválido");
        }
    }

    // NUEVO: Método para confirmar recolección con firma
    @Transactional
    public Recoleccion confirmarRecoleccionConFirma(Integer idRecoleccion, String firmaBase64) {
        Recoleccion recoleccion = recoleccionRepository.findById(idRecoleccion)
                .orElseThrow(() -> new RuntimeException("Recolección no encontrada con ID: " + idRecoleccion));

        recoleccion.setFirmaBase64(firmaBase64);
        recoleccion.setEstado("confirmada"); // O el estado final que desees
        return recoleccionRepository.save(recoleccion);
    }
}