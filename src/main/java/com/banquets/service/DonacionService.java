package com.banquets.service;

import com.banquets.entity.Donacion;
import com.banquets.repository.DonacionRepository;
import com.banquets.dto.DonacionResponseDTO; // <--- Importa el DTO
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors; // <--- Importa Collectors

@Service
public class DonacionService {

    @Autowired
    private DonacionRepository donacionRepository;

    public Donacion crearDonacion(Donacion donacion) {
        return donacionRepository.save(donacion);
    }

    // Modificamos este método para que devuelva una lista de DTOs
    public List<DonacionResponseDTO> obtenerPorDonadorYEstado(Integer idDonador, String estado) {
        List<Donacion> donaciones = donacionRepository.findByDonadorIdDonadorAndEstado(idDonador, estado);
        // Convierte cada entidad Donacion a DonacionResponseDTO
        return donaciones.stream()
                .map(DonacionResponseDTO::new) // Utiliza el constructor del DTO
                .collect(Collectors.toList());
    }

    // Modificamos este método para que devuelva una lista de DTOs
    public List<DonacionResponseDTO> obtenerPorEstado(String estado) {
        List<Donacion> donaciones = donacionRepository.findByEstado(estado);
        // Convierte cada entidad Donacion a DonacionResponseDTO
        return donaciones.stream()
                .map(DonacionResponseDTO::new)
                .collect(Collectors.toList());
    }

    public Donacion actualizarEstado(Integer idDonacion, String nuevoEstado) {
        Donacion donacion = donacionRepository.findById(idDonacion)
                .orElseThrow(() -> new RuntimeException("Donación no encontrada"));
        donacion.setEstado(nuevoEstado);
        return donacionRepository.save(donacion);
    }

    // Nuevo método para obtener una donación por ID y devolverla como DTO (útil para detalles)
    public DonacionResponseDTO obtenerDonacionPorIdAsDTO(Integer idDonacion) {
        Donacion donacion = donacionRepository.findById(idDonacion)
                .orElseThrow(() -> new RuntimeException("Donación no encontrada"));
        return new DonacionResponseDTO(donacion);
    }

    // Método para eliminar donación
    public void eliminarDonacion(Integer idDonacion) {
        // Podrías añadir lógica de negocio, como verificar el estado o si el usuario autenticado es el donador
        if (!donacionRepository.existsById(idDonacion)) {
            throw new RuntimeException("Donación no encontrada con ID: " + idDonacion);
        }
        donacionRepository.deleteById(idDonacion);
    }
}