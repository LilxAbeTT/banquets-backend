package com.banquets.service;

import com.banquets.entity.Recoleccion;
import com.banquets.repository.RecoleccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecoleccionService {

    @Autowired
    private RecoleccionRepository recoleccionRepository;

    public Recoleccion crearRecoleccion(Recoleccion recoleccion) {
        return recoleccionRepository.save(recoleccion);
    }

    public Recoleccion actualizarRecoleccion(Recoleccion recoleccion) {
        return recoleccionRepository.save(recoleccion);
    }

    public List<Recoleccion> obtenerPorOrganizacion(Integer idOrganizacion) {
        return recoleccionRepository.findByOrganizacionIdOrganizacion(idOrganizacion);
    }

    public List<Recoleccion> obtenerPorDonador(Integer idDonador) {
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

}
