package com.banquets.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class CorreoService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarCredenciales(String destinatario, String contrasena) {
        String asunto = "¡Tu solicitud en BanQuets fue aprobada!";
        String cuerpo = "<h2 style='color:#2e7d32;'>Bienvenido a BanQuets</h2>" +
                "<p>Tu cuenta ha sido aprobada exitosamente.</p>" +
                "<p><strong>Correo:</strong> " + destinatario + "<br>" +
                "<strong>Contraseña:</strong> " + contrasena + "</p>" +
                "<p>Te recomendamos iniciar sesión y cambiar tu contraseña desde tu perfil.</p>" +
                "<p style='margin-top:20px;'>Gracias por apoyar el rescate de alimentos 💚</p>";

        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");

            helper.setTo(destinatario);
            helper.setSubject(asunto);
            helper.setText(cuerpo, true); // true = HTML

            mailSender.send(mensaje);
        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar el correo: " + e.getMessage());
        }
    }
}
