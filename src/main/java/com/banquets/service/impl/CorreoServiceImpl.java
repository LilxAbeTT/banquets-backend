package com.banquets.service.impl;

import com.banquets.service.CorreoService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class CorreoServiceImpl implements CorreoService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void enviar(String destino, String asunto, String contenido) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");

            helper.setTo(destino);
            helper.setSubject(asunto);
            helper.setText(contenido, false); // false = texto plano

            mailSender.send(mensaje);
        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar el correo: " + e.getMessage(), e);
        }
    }

    public void enviarCorreoRecuperacion(String destino, String nombre, String contrasenaTemporal) throws MessagingException {
        String asunto = "Recuperación de contraseña - BanQuets";

        String cuerpo = """
        <p>Estimado(a) <strong>%s</strong>,</p>

        <p>Ha solicitado recuperar el acceso a su cuenta de <strong>BanQuets</strong>.</p>

        <p>Hemos generado una nueva contraseña temporal para que pueda ingresar al sistema:</p>
        <ul>
            <li><strong>Correo:</strong> %s</li>
            <li><strong>Contraseña temporal:</strong> %s</li>
        </ul>

        <p>Le recomendamos iniciar sesión y cambiar su contraseña inmediatamente desde el menú de perfil.</p>

        <p>Si usted no solicitó esta recuperación, por favor ignore este mensaje.</p>

        <p>Atentamente,<br/>Equipo de BanQuets</p>
    """.formatted(nombre, destino, contrasenaTemporal);

        enviar(destino, asunto, cuerpo);
    }


    @Override
    public void enviarCredenciales(String destino, String contrasena) {
        String asunto = "Bienvenido a BanQuets - Acceso concedido";
        String cuerpo = """
                Estimado/a,

                Su solicitud ha sido aprobada exitosamente. A continuación encontrará sus credenciales de acceso:

                Usuario (correo): %s
                Contraseña: %s

                Por favor, acceda al sistema y cambie su contraseña después de iniciar sesión.

                Atentamente,
                Equipo de BanQuets
                """.formatted(destino, contrasena);

        enviar(destino, asunto, cuerpo);
    }

    @Override
    public void enviarCorreoAprobacion(String correo, String nombre, String tipoUsuario, String contrasenaGenerada) throws MessagingException {
        String asunto = "Bienvenido a BanQuets - Acceso Aprobado";
        String cuerpo = """
                <p>Estimado(a) <strong>%s</strong>,</p>

                <p>Nos complace informarle que su solicitud para registrarse como <strong>%s</strong> en la plataforma <strong>BanQuets</strong> ha sido <strong>aprobada exitosamente</strong>.</p>

                <p>A continuación, le proporcionamos sus datos de acceso:</p>
                <ul>
                    <li><strong>Correo electrónico (usuario):</strong> %s</li>
                    <li><strong>Contraseña temporal:</strong> %s</li>
                </ul>

                <p>Por motivos de seguridad, le recomendamos cambiar su contraseña una vez haya iniciado sesión.</p>

                <p>Gracias por unirse a nuestro esfuerzo por combatir la inseguridad alimentaria y apoyar a quienes más lo necesitan.</p>

                <p>Atentamente,<br/>Equipo de BanQuets</p>
                """.formatted(nombre, tipoUsuario.toLowerCase(), correo, contrasenaGenerada);

        enviar(correo, asunto, cuerpo);
    }

    @Override
    public void enviarCorreoRechazo(String correo, String nombre, String tipoUsuario, String motivoRechazo) throws MessagingException {
        String asunto = "Resultado de Solicitud - Registro Rechazado en BanQuets";
        String cuerpo = """
                <p>Estimado(a) <strong>%s</strong>,</p>

                <p>Lamentamos informarle que su solicitud para registrarse como <strong>%s</strong> en la plataforma <strong>BanQuets</strong> ha sido <strong>rechazada</strong>.</p>

                <p><strong>Motivo proporcionado:</strong></p>
                <blockquote style="color: #a00; font-style: italic;">%s</blockquote>

                <p>Le invitamos a revisar los datos enviados y, si lo desea, enviar una nueva solicitud con las correcciones correspondientes.</p>

                <p>Gracias por su interés en BanQuets.</p>

                <p>Atentamente,<br/>Equipo de BanQuets</p>
                """.formatted(nombre, tipoUsuario.toLowerCase(), motivoRechazo);

        enviar(correo, asunto, cuerpo);
    }
}
