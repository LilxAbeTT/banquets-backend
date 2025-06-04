// src/main/java/com/banquets/service/DonacionService.java
package com.banquets.service;

import com.banquets.entity.Donacion;
import com.banquets.repository.DonacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Importa Transactional

import java.util.List;
import java.util.stream.Collectors; // Para usar streams

@Service
public class DonacionService {

    @Autowired
    private DonacionRepository donacionRepository;

    public Donacion crearDonacion(Donacion donacion) {
        return donacionRepository.save(donacion);
    }

    // Método existente
    public List<Donacion> obtenerPorDonadorYEstado(Integer idDonador, String estado) {
        return donacionRepository.findByDonadorIdDonadorAndEstado(idDonador, estado);
    }

    // NUEVO: Obtener donaciones activas (pendientes o en_proceso) de un donador
    public List<Donacion> obtenerDonacionesActivasPorDonador(Integer idDonador) {
        // Obtenemos todas las donaciones del donador
        List<Donacion> todasLasDonacionesDelDonador = donacionRepository.findByDonadorIdDonador(idDonador);

        // Filtramos para obtener solo las que no están 'recolectadas'
        return todasLasDonacionesDelDonador.stream()
                .filter(d -> !"recolectadas".equalsIgnoreCase(d.getEstado()))
                .collect(Collectors.toList());
    }

    public List<Donacion> obtenerPorEstado(String estado) {
        return donacionRepository.findByEstado(estado);
    }

    @Transactional // Asegura que la operación sea atómica
    public Donacion actualizarEstado(Integer idDonacion, String nuevoEstado) {
        Donacion donacion = donacionRepository.findById(idDonacion)
                .orElseThrow(() -> new RuntimeException("Donación no encontrada con ID: " + idDonacion));
        donacion.setEstado(nuevoEstado);
        return donacionRepository.save(donacion);
    }

    // NUEVO: Eliminar donación por ID y verificar que pertenezca al donador y esté en estado 'pendientes'
    @Transactional // Asegura que la operación sea atómica
    public void eliminarDonacion(Integer idDonacion, Integer idDonadorAutenticado) {
        Donacion donacion = donacionRepository.findById(idDonacion)
                .orElseThrow(() -> new RuntimeException("Donación no encontrada con ID: " + idDonacion));

        // Verificar que la donación pertenece al donador autenticado
        if (!donacion.getDonador().getIdDonador().equals(idDonadorAutenticado)) {
            throw new RuntimeException("Acceso denegado: No tienes permiso para eliminar esta donación.");
        }

        // Solo permitir eliminar si la donación está 'pendientes'
        if (!"pendientes".equalsIgnoreCase(donacion.getEstado())) {
            throw new RuntimeException("No se puede eliminar la donación porque su estado no es 'pendientes'. Estado actual: " + donacion.getEstado());
        }

        donacionRepository.delete(donacion);
    }
}