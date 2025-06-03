package com.banquets.controller;

import com.banquets.entity.MensajeChat;
import com.banquets.service.MensajeChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private MensajeChatService mensajeChatService;

    // Enviar mensaje
    @PostMapping
    public ResponseEntity<MensajeChat> enviarMensaje(@RequestBody MensajeChat mensaje) {
        return ResponseEntity.ok(mensajeChatService.crearMensaje(mensaje));
    }

    // Obtener mensajes por recolección
    @GetMapping("/{idRecoleccion}")
    public ResponseEntity<List<MensajeChat>> obtenerMensajes(@PathVariable Integer idRecoleccion) {
        return ResponseEntity.ok(mensajeChatService.obtenerPorRecoleccion(idRecoleccion));
    }
}
