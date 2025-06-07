package com.banquets.service;

import jakarta.mail.MessagingException;

public interface CorreoService {
    void enviar(String destino, String asunto, String contenido);

    void enviarCredenciales(String destino, String contrasena);

    void enviarCorreoAprobacion(String correo, String nombre, String tipoUsuario, String contrasenaGenerada) throws MessagingException;

    void enviarCorreoRechazo(String correo, String nombre, String tipoUsuario, String motivoRechazo) throws MessagingException;
}
