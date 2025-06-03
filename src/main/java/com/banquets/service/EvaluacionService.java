package com.banquets.service;

import com.banquets.entity.Evaluacion;
import com.banquets.repository.EvaluacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EvaluacionService {

    @Autowired
    private EvaluacionRepository evaluacionRepository;

    public Evaluacion crearEvaluacion(Evaluacion evaluacion) {
        return evaluacionRepository.save(evaluacion);
    }

    public List<Evaluacion> obtenerPorOrganizacion(Integer idOrganizacion) {
        return evaluacionRepository.findByRecoleccionOrganizacionIdOrganizacion(idOrganizacion);
    }

    public List<Evaluacion> obtenerPorDonador(Integer idDonador) {
        return evaluacionRepository.findByRecoleccionDonacionDonadorIdDonador(idDonador);
    }

    public List<Evaluacion> obtenerPorUsuario(Integer idUsuario, String tipoUsuario) {
        if ("DONADOR".equalsIgnoreCase(tipoUsuario)) {
            return evaluacionRepository.findByRecoleccionDonacionDonadorIdDonador(idUsuario);
        } else if ("ORGANIZACION".equalsIgnoreCase(tipoUsuario)) {
            return evaluacionRepository.findByRecoleccionOrganizacionIdOrganizacion(idUsuario);
        } else {
            throw new IllegalArgumentException("Tipo de usuario inválido");
        }
    }

}
