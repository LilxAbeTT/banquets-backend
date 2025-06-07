package com.banquets.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class RecuperacionService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void enviarNuevaContrasena(String correo) throws MessagingException {
        // Generar contraseña segura
        String nueva = generarPasswordTemporal();
        String hash = passwordEncoder.encode(nueva);

        // Actualizar en BD
        jdbcTemplate.update("EXEC sp_restaurar_contrasena ?, ?", correo, hash);

        // Enviar correo
        MimeMessage msg = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(msg, true);

        helper.setTo(correo);
        helper.setSubject("Recuperación de Contraseña - BanQuets");
        helper.setText("""
                Hola, hemos generado una nueva contraseña temporal para tu cuenta BanQuets:
                
                Nueva contraseña: <b>%s</b>
                
                Por favor, inicia sesión con esta y cámbiala de inmediato desde tu perfil.
                """.formatted(nueva), true);

        mailSender.send(msg);
    }

    private String generarPasswordTemporal() {
        SecureRandom random = new SecureRandom();
        String caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            sb.append(caracteres.charAt(random.nextInt(caracteres.length())));
        }
        return sb.toString();
    }
}
