package com.banquets.service;

import com.banquets.dto.EditarDonacionDTO;
import com.banquets.dto.ImagenDonacionDTO;
import com.banquets.entity.Donacion;
import com.banquets.repository.DonacionRepository;
import com.banquets.dto.DonacionResponseDTO;
import com.banquets.entity.view.DonacionDetalleView;
import com.banquets.repository.view.DonacionDetalleViewRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Base64;
import java.util.stream.Collectors;

@Service
public class DonacionService {

    @Autowired
    private DonacionRepository donacionRepository;

    @Autowired
    private DonacionDetalleViewRepository donacionDetalleViewRepository;
    @Autowired
    private JdbcTemplate jdbcTemplate;
    // Método para crear una donación y devolverla como DTO completamente cargado
    @Transactional // <--- Asegura que la transacción esté activa para las relaciones
    public DonacionResponseDTO crearDonacionAndReturnDTO(Donacion donacion) {
        Donacion savedDonacion = donacionRepository.save(donacion);
        // Después de guardar, recuperamos la donación usando la vista
        // Esto asegura que todas las relaciones necesarias para el DTO estén cargadas
        DonacionDetalleView donacionView = donacionDetalleViewRepository.findByIdDonacion(savedDonacion.getIdDonacion())
                .orElseThrow(() -> new RuntimeException("Donación recién creada no encontrada en la vista."));
        return convertDonacionViewToDTO(donacionView);
    }

    @Transactional(readOnly = true)
    public List<DonacionResponseDTO> obtenerDonacionesPropiasParaDashboard(Integer idDonador) {
        List<DonacionDetalleView> donacionesView = donacionDetalleViewRepository.findByIdDonador(idDonador);
        return donacionesView.stream()
                .map(this::convertDonacionViewToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DonacionResponseDTO> obtenerPorEstado(String estado) {
        List<DonacionDetalleView> donacionesView = donacionDetalleViewRepository.findByEstado(estado);
        return donacionesView.stream()
                .map(this::convertDonacionViewToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public Donacion actualizarEstado(Integer idDonacion, String nuevoEstado) {
        Donacion donacion = donacionRepository.findById(idDonacion)
                .orElseThrow(() -> new RuntimeException("Donación no encontrada con ID: " + idDonacion));

        if (!Arrays.asList("pendientes", "en_proceso", "recolectadas").contains(nuevoEstado)) {
            throw new IllegalArgumentException("Estado de donación inválido: " + nuevoEstado);
        }

        donacion.setEstado(nuevoEstado);
        return donacionRepository.save(donacion);
    }

    @Transactional(readOnly = true)
    public DonacionResponseDTO obtenerDonacionPorIdAsDTO(Integer idDonacion) {
        DonacionDetalleView donacionView = donacionDetalleViewRepository.findByIdDonacion(idDonacion)
                .orElseThrow(() -> new RuntimeException("Donación no encontrada"));
        return convertDonacionViewToDTO(donacionView);
    }

    @Transactional
    public void eliminarDonacion(Integer idDonacion, Integer idUsuarioAutenticado, String tipoUsuario) {
        // Para la eliminación, todavía necesitamos la entidad original para verificar la propiedad
        Donacion donacion = donacionRepository.findById(idDonacion) // Asegúrate que esto cargue el Donador si es necesario
                .orElseThrow(() -> new RuntimeException("Donación no encontrada con ID: " + idDonacion));

        // Para evitar LazyInitializationException al acceder a donacion.getDonador()
        // si Donacion.donador es Lazy, considera usar donacionRepository.findByIdFetchDonador(idDonacion)
        // si ya lo tienes definido para operaciones transaccionales.
        // O si no lo tienes, simplemente busca el donador explícitamente dentro de la transacción.
        if (donacion.getDonador() == null || !donacion.getDonador().getIdDonador().equals(idUsuarioAutenticado) && !"ADMIN".equals(tipoUsuario)) {
            throw new RuntimeException("Acceso denegado: No tienes permiso para eliminar esta donación o el donador no está cargado.");
        }

        if (!"pendientes".equals(donacion.getEstado())) {
            throw new RuntimeException("La donación no se puede eliminar. Su estado actual es: " + donacion.getEstado());
        }

        donacionRepository.delete(donacion);
    }

    private DonacionResponseDTO convertDonacionViewToDTO(DonacionDetalleView view) {
        String imagenBase64 = null;
        if (view.getImagen() != null && view.getImagen().length > 0) {
            imagenBase64 = Base64.getEncoder().encodeToString(view.getImagen());
        }

        return new DonacionResponseDTO(
                view.getIdDonacion(),
                view.getTitulo(),
                view.getDescripcion(),
                view.getTipo(),
                view.getCategoria(),
                view.getCantidad(),
                view.getFechaPublicacion(),
                view.getFechaLimite(),
                view.getEstado(),
                imagenBase64,
                view.getLatitud(),
                view.getLongitud(),
                view.getEmpacado(),
                view.getEstadoComida(),
                view.getIdDonador(),
                view.getDonadorNombreEmpresa(),
                view.getDonadorCorreo(),
                view.getDonadorTelefono()
        );
    }

    public void actualizarDonacion(EditarDonacionDTO dto) {
        jdbcTemplate.update("EXEC sp_actualizar_donacion ?,?,?,?,?,?,?,?,?,?",
                dto.getIdDonacion(),
                dto.getTitulo(),
                dto.getDescripcion(),
                dto.getTipo(),
                dto.getCategoria(),
                dto.getCantidad(),
                dto.getFechaLimite(),
                dto.getEstadoComida(),
                dto.getEmpacado(),
                dto.getLatitud(),
                dto.getLongitud()
        );
    }

    public void cancelarDonacion(Integer idDonacion) {
        jdbcTemplate.update("EXEC sp_cancelar_donacion ?", idDonacion);
    }

    public void subirImagenDonacion(ImagenDonacionDTO dto) {
        byte[] binario = java.util.Base64.getDecoder().decode(dto.getImagenBase64());
        jdbcTemplate.update("EXEC sp_subir_imagen_donacion ?, ?", dto.getIdDonacion(), binario);
    }


}