package com.banquets.service;

import com.banquets.entity.Donacion;
import com.banquets.repository.DonacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DonacionService {

    @Autowired
    private DonacionRepository donacionRepository;

    public Donacion crearDonacion(Donacion donacion) {
        return donacionRepository.save(donacion);
    }

    public List<Donacion> obtenerPorDonadorYEstado(Integer idDonador, String estado) {
        return donacionRepository.findByDonadorIdDonadorAndEstado(idDonador, estado);
    }

    public List<Donacion> obtenerPorEstado(String estado) {
        return donacionRepository.findByEstado(estado);
    }

    public Donacion actualizarEstado(Integer idDonacion, String nuevoEstado) {
        Donacion donacion = donacionRepository.findById(idDonacion)
                .orElseThrow(() -> new RuntimeException("Donación no encontrada"));
        donacion.setEstado(nuevoEstado);
        return donacionRepository.save(donacion);
    }
}
