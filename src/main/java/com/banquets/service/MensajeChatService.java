package com.banquets.service;

import com.banquets.entity.MensajeChat;
import com.banquets.repository.MensajeChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MensajeChatService {

    @Autowired
    private MensajeChatRepository mensajeChatRepository;

    public MensajeChat crearMensaje(MensajeChat mensaje) {
        return mensajeChatRepository.save(mensaje);
    }

    public List<MensajeChat> obtenerPorRecoleccion(Integer idRecoleccion) {
        return mensajeChatRepository.findByRecoleccionIdRecoleccionOrderByFechaAsc(idRecoleccion);
    }
}
