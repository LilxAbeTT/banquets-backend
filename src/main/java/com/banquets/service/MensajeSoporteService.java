package com.banquets.service;

import com.banquets.entity.MensajeSoporte;
import com.banquets.repository.MensajeSoporteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MensajeSoporteService {

    @Autowired
    private MensajeSoporteRepository mensajeSoporteRepository;

    public MensajeSoporte crearMensaje(MensajeSoporte mensaje) {
        return mensajeSoporteRepository.save(mensaje);
    }

    public MensajeSoporte marcarRespondido(Integer idMensaje) {
        MensajeSoporte mensaje = mensajeSoporteRepository.findById(idMensaje)
                .orElseThrow(() -> new RuntimeException("Mensaje no encontrado"));
        mensaje.setRespondido(true);
        return mensajeSoporteRepository.save(mensaje);
    }

    public List<MensajeSoporte> listarPendientes() {
        return mensajeSoporteRepository.findByRespondidoFalse();
    }
}
