package com.banquets.service;

import com.banquets.dto.ConfirmarEntregaDTO;
import com.banquets.entity.Donacion; // <--- Importar Donacion
import com.banquets.entity.Organizacion; // <--- Importar Organizacion
import com.banquets.entity.Recoleccion;
import com.banquets.repository.DonacionRepository; // <--- Importar DonacionRepository
import com.banquets.repository.OrganizacionRepository; // <--- Importar OrganizacionRepository
import com.banquets.repository.RecoleccionRepository;
import com.banquets.dto.DonacionResponseDTO.RecoleccionDTO;
import com.banquets.entity.view.RecoleccionDetalleView;
import com.banquets.repository.view.RecoleccionDetalleViewRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime; // Para fecha de aceptación
import java.util.List;
import java.util.Base64;
import java.util.stream.Collectors;

@Service
public class RecoleccionService {

    @Autowired
    private RecoleccionRepository recoleccionRepository;

    @Autowired
    private RecoleccionDetalleViewRepository recoleccionDetalleViewRepository;

    @Autowired
    private DonacionRepository donacionRepository; // <--- Inyectar DonacionRepository

    @Autowired
    private OrganizacionRepository organizacionRepository; // <--- Inyectar OrganizacionRepository
    @Autowired
    private JdbcTemplate jdbcTemplate;
    // Modificado: Este método debería recibir IDs y crear la Recoleccion y actualizar Donacion
    @Transactional
    public Recoleccion crearRecoleccionYActualizarDonacion(Integer idDonacion, Integer idOrganizacion, LocalDateTime fechaEstimadaRecoleccion) { // <--- Nuevos parámetros
        // 1. Buscar la Donacion
        Donacion donacion = donacionRepository.findById(idDonacion)
                .orElseThrow(() -> new RuntimeException("Donación no encontrada con ID: " + idDonacion));

        // Validar que la donación esté pendiente
        if (!"pendientes".equals(donacion.getEstado())) {
            throw new RuntimeException("La donación no está pendiente y no puede ser aceptada.");
        }

        // 2. Buscar la Organizacion
        Organizacion organizacion = organizacionRepository.findById(idOrganizacion)
                .orElseThrow(() -> new RuntimeException("Organización no encontrada con ID: " + idOrganizacion));

        // 3. Crear la Recoleccion
        Recoleccion nuevaRecoleccion = new Recoleccion();
        nuevaRecoleccion.setDonacion(donacion);
        nuevaRecoleccion.setOrganizacion(organizacion);
        nuevaRecoleccion.setFechaAceptacion(LocalDateTime.now()); // Fecha de aceptación actual
        nuevaRecoleccion.setEstado("aceptada"); // Estado inicial de la recolección

        Recoleccion recoleccionGuardada = recoleccionRepository.save(nuevaRecoleccion);

        // 4. Actualizar el estado de la Donacion a 'en_proceso'
        donacion.setEstado("en_proceso");
        donacionRepository.save(donacion); // Guardar la donación con el nuevo estado

        return recoleccionGuardada;
    }


    @Transactional
    public Recoleccion actualizarRecoleccion(Recoleccion recoleccion) {
        return recoleccionRepository.save(recoleccion);
    }

    @Transactional(readOnly = true)
    public List<RecoleccionDTO> obtenerPorOrganizacion(Integer idOrganizacion) {
        List<RecoleccionDetalleView> recoleccionesView = recoleccionDetalleViewRepository.findByIdOrganizacion(idOrganizacion);
        return recoleccionesView.stream()
                .map(RecoleccionDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RecoleccionDTO> obtenerPorDonador(Integer idDonador) {
        List<RecoleccionDetalleView> recoleccionesView = recoleccionDetalleViewRepository.findByIdDonador(idDonador);
        return recoleccionesView.stream()
                .map(RecoleccionDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RecoleccionDTO> obtenerPorUsuario(Integer idUsuario, String tipoUsuario) {
        List<RecoleccionDetalleView> recoleccionesView;
        if ("DONADOR".equalsIgnoreCase(tipoUsuario)) {
            recoleccionesView = recoleccionDetalleViewRepository.findByIdDonador(idUsuario);
        } else if ("ORGANIZACION".equalsIgnoreCase(tipoUsuario)) {
            recoleccionesView = recoleccionDetalleViewRepository.findByIdOrganizacion(idUsuario);
        } else if ("ADMIN".equalsIgnoreCase(tipoUsuario)) {
            recoleccionesView = recoleccionDetalleViewRepository.findAll();
        } else {
            throw new IllegalArgumentException("Tipo de usuario inválido o no autorizado para ver recolecciones.");
        }
        return recoleccionesView.stream()
                .map(RecoleccionDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public Recoleccion confirmarRecoleccion(Integer idRecoleccion, String firmaBase64, Integer idDonadorAutenticado, String tipoUsuario) {
        Recoleccion recoleccion = recoleccionRepository.findById(idRecoleccion)
                .orElseThrow(() -> new RuntimeException("Recolección no encontrada con ID: " + idRecoleccion));

        // Para esta verificación, necesitamos la donación y el donador relacionados.
        // Si la relación recoleccion.donacion es LAZY, esto daría LazyInitializationException.
        // Asegúrate de que el método findById() de recoleccionRepository cargue la donación y su donador.
        // Si no, usa un método @Query con JOIN FETCH como findByIdWithDetails().
        if (!recoleccion.getDonacion().getDonador().getIdDonador().equals(idDonadorAutenticado) && !"ADMIN".equals(tipoUsuario)) {
            throw new RuntimeException("Acceso denegado: No tienes permiso para confirmar esta recolección.");
        }

        if (!"aceptada".equals(recoleccion.getEstado())) {
            throw new RuntimeException("La recolección no puede ser confirmada. Su estado actual es: " + recoleccion.getEstado());
        }

        recoleccion.setFirmaBase64(firmaBase64);
        recoleccion.setEstado("confirmada");
        return recoleccionRepository.save(recoleccion);
    }

    @Transactional
    public Recoleccion subirComprobante(Integer idRecoleccion, byte[] comprobanteImagen, Integer idOrganizacionAutenticada) throws IOException {
        Recoleccion recoleccion = recoleccionRepository.findById(idRecoleccion)
                .orElseThrow(() -> new RuntimeException("Recolección no encontrada con ID: " + idRecoleccion));

        // Similar a la confirmación, asegura que la organización esté cargada.
        // Si recoleccion.getOrganizacion() es LAZY, usar findByIdWithDetails().
        if (!recoleccion.getOrganizacion().getIdOrganizacion().equals(idOrganizacionAutenticada) && !"ADMIN".equals(idOrganizacionAutenticada)) {
            throw new RuntimeException("Acceso denegado: No tienes permiso para subir comprobante para esta recolección.");
        }

        recoleccion.setComprobanteImagen(comprobanteImagen);
        return recoleccionRepository.save(recoleccion);
    }

    public void confirmarEntrega(ConfirmarEntregaDTO dto) {
        byte[] comprobanteBytes = null;
        if (dto.getComprobanteBase64() != null && !dto.getComprobanteBase64().isEmpty()) {
            comprobanteBytes = java.util.Base64.getDecoder().decode(dto.getComprobanteBase64());
        }

        jdbcTemplate.update("EXEC sp_confirmar_entrega_donacion ?, ?, ?",
                dto.getIdRecoleccion(),
                dto.getFirmaBase64(),
                comprobanteBytes);
    }

}