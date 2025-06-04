package com.banquets.service.impl;

import com.banquets.dto.SolicitudIngresoDTO;
import com.banquets.entity.Donador;
import com.banquets.entity.Organizacion;
import com.banquets.entity.SolicitudIngreso;
import com.banquets.entity.Usuario;
import com.banquets.repository.DonadorRepository;
import com.banquets.repository.OrganizacionRepository;
import com.banquets.repository.SolicitudIngresoRepository;
import com.banquets.repository.UsuarioRepository;
import com.banquets.service.CorreoService;
import com.banquets.service.SolicitudIngresoService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class SolicitudIngresoServiceImpl implements SolicitudIngresoService {

    private final SolicitudIngresoRepository solicitudIngresoRepository;
    private final UsuarioRepository usuarioRepository;
    private final DonadorRepository donadorRepository;
    private final OrganizacionRepository organizacionRepository;
    private final PasswordEncoder passwordEncoder; // <-- Usa la interfaz aquí
    private final CorreoService correoService;

    public SolicitudIngresoServiceImpl(
            SolicitudIngresoRepository solicitudIngresoRepository,
            UsuarioRepository usuarioRepository,
            DonadorRepository donadorRepository,
            OrganizacionRepository organizacionRepository,
            PasswordEncoder passwordEncoder, CorreoService correoService // <-- Recibe la interfaz
    ) {
        this.solicitudIngresoRepository = solicitudIngresoRepository;
        this.usuarioRepository = usuarioRepository;
        this.donadorRepository = donadorRepository;
        this.organizacionRepository = organizacionRepository;
        this.passwordEncoder = passwordEncoder;
        this.correoService = correoService;
    }

    @Override
    public SolicitudIngreso crearDesdeDTO(SolicitudIngresoDTO dto) {
        SolicitudIngreso solicitud = new SolicitudIngreso();
        solicitud.setNombre(dto.getNombre());
        solicitud.setCorreo(dto.getCorreo());
        solicitud.setTelefono(dto.getTelefono());
        solicitud.setTipoUsuario(dto.getTipoUsuario());
        solicitud.setNombreEmpresa(dto.getNombreEmpresa());
        solicitud.setDescripcion(dto.getDescripcion());
        solicitud.setRfc(dto.getRfc());
        solicitud.setUrl(dto.getUrl());
        solicitud.setDireccion(dto.getDireccion());
        solicitud.setLatitud(dto.getLatitud());
        solicitud.setLongitud(dto.getLongitud());
        solicitud.setEstado("pendiente");
        return solicitudIngresoRepository.save(solicitud);
    }

    @Override
    public SolicitudIngreso actualizarEstado(Integer idSolicitud, String estado) {
        SolicitudIngreso solicitud = solicitudIngresoRepository.findById(idSolicitud)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
        solicitud.setEstado(estado);
        return solicitudIngresoRepository.save(solicitud);
    }

    @Override
    public List<SolicitudIngreso> listarPorEstado(String estado) {
        return solicitudIngresoRepository.findByEstado(estado);
    }

    @Override
    public SolicitudIngreso aprobar(Integer idSolicitud) {
        SolicitudIngreso solicitud = solicitudIngresoRepository.findById(idSolicitud)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        solicitud.setEstado("aprobado");

        // Generar contraseña aleatoria segura
        String contrasenaGenerada = generarContrasenaAleatoria();
        String contrasenaCifrada = passwordEncoder.encode(contrasenaGenerada);

        // Crear usuario
        Usuario nuevo = new Usuario();
        nuevo.setNombre(solicitud.getNombre());
        nuevo.setCorreo(solicitud.getCorreo());
        nuevo.setTelefono(solicitud.getTelefono());
        nuevo.setTipoUsuario(solicitud.getTipoUsuario());
        nuevo.setContrasena(contrasenaCifrada);

        Usuario usuarioGuardado = usuarioRepository.save(nuevo);
        correoService.enviarCredenciales(solicitud.getCorreo(), contrasenaGenerada);

        // Crear rol específico
        if ("DONADOR".equalsIgnoreCase(solicitud.getTipoUsuario())) {
            Donador donador = new Donador();
            donador.setIdDonador(usuarioGuardado.getIdUsuario());
            donador.setNombreEmpresa(solicitud.getNombreEmpresa());
            donador.setDescripcion(solicitud.getDescripcion());
            donador.setRfc(solicitud.getRfc());
            donador.setUrl(solicitud.getUrl());
            donadorRepository.save(donador);
        } else if ("ORGANIZACION".equalsIgnoreCase(solicitud.getTipoUsuario())) {
            Organizacion org = new Organizacion();
            org.setIdOrganizacion(usuarioGuardado.getIdUsuario());
            org.setNombreEmpresa(solicitud.getNombreEmpresa());
            org.setDescripcion(solicitud.getDescripcion());
            organizacionRepository.save(org);
        }

        // Aquí luego se llamará al servicio de envío de correo
        // enviarCorreoCredenciales(solicitud.getCorreo(), contrasenaGenerada);

        return solicitudIngresoRepository.save(solicitud);
    }

    @Override
    public SolicitudIngreso rechazar(Integer idSolicitud) {
        SolicitudIngreso solicitud = solicitudIngresoRepository.findById(idSolicitud)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        solicitud.setEstado("rechazado");
        return solicitudIngresoRepository.save(solicitud);
    }

    private String generarContrasenaAleatoria() {
        String caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$#";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < 10; i++) {
            sb.append(caracteres.charAt(random.nextInt(caracteres.length())));
        }
        return sb.toString();
    }
}
