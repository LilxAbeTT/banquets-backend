package com.banquets.service;

import com.banquets.dto.CambiarContrasenaDTO;
import com.banquets.entity.TokenRecuperacion;
import com.banquets.entity.Usuario;
import com.banquets.repository.TokenRecuperacionRepository;
import com.banquets.repository.UsuarioRepository;
import com.banquets.service.impl.CorreoServiceImpl;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Importar si no está

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private TokenRecuperacionRepository tokenRecuperacionRepository;

    @Autowired
    private CorreoService correoService;

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Transactional
    public void enviarTokenRecuperacion(String correo) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(correo);

        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("No se pudo enviar el correo. Verifica que el correo esté registrado.");
        }

        Usuario usuario = usuarioOpt.get();

        // Generar token aleatorio (puedes guardar este token en la base si usaras recuperación segura con enlace)
        String nuevaContrasena = generarContrasenaTemporal(); // Método auxiliar

        // Actualizar la contraseña directamente (temporal)
        usuario.setContrasena(passwordEncoder.encode(nuevaContrasena));
        usuarioRepository.save(usuario);

        try {
            correoService.enviarCorreoRecuperacion(usuario.getCorreo(), usuario.getNombre(), nuevaContrasena);
        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar el correo de recuperación: " + e.getMessage());
        }
    }

    private String generarContrasenaTemporal() {
        return UUID.randomUUID().toString().substring(0, 10).replace("-", ""); // 10 caracteres aleatorios
    }

    @Transactional // Asegurar que sea transaccional si realiza cambios
    public Usuario registrarUsuario(Usuario usuario) {
        if (usuarioRepository.findByCorreo(usuario.getCorreo()).isPresent()) {
            throw new RuntimeException("Correo ya registrado");
        }
        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
        usuario.setEstado(true); // <--- CAMBIO CLAVE AQUÍ: Asigna un Boolean (true para activo)
        return usuarioRepository.save(usuario);
    }

    @Transactional(readOnly = true)
    public Optional<Usuario> buscarPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo);
    }

    @Transactional(readOnly = true)
    public Optional<Usuario> buscarPorId(Integer id) {
        return usuarioRepository.findById(id);
    }

    @Transactional
    public Usuario actualizarDatos(Integer idUsuario, String nombre, String telefono) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setNombre(nombre);
        usuario.setTelefono(telefono);
        return usuarioRepository.save(usuario);
    }

    @Transactional
    public void actualizarContrasena(Integer idUsuario, String contrasenaNueva) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setContrasena(passwordEncoder.encode(contrasenaNueva));
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void actualizarIntentosLogin(Integer idUsuario, int intentos, LocalDateTime ultimoLogin) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setIntentosFallidos(intentos);
        if (ultimoLogin != null) {
            usuario.setFechaUltimoLogin(ultimoLogin);
        }
        usuarioRepository.save(usuario);
    }

    @Transactional(readOnly = true)
    public List<Usuario> buscarTodos() {
        return usuarioRepository.findAll();
    }

    public boolean cambiarContrasena(CambiarContrasenaDTO dto, String contrasenaHashActualDB) {
        if (!passwordEncoder.matches(dto.getContrasenaActual(), contrasenaHashActualDB)) {
            return false;
        }

        String nuevaHash = passwordEncoder.encode(dto.getNuevaContrasena());

        jdbcTemplate.update("EXEC sp_cambiar_contrasena_usuario ?, ?, ?",
                dto.getIdUsuario(), contrasenaHashActualDB, nuevaHash);

        return true;
    }


}