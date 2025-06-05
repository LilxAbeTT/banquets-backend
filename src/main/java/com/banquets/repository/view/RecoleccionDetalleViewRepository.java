package com.banquets.repository.view;

import com.banquets.entity.view.RecoleccionDetalleView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecoleccionDetalleViewRepository extends JpaRepository<RecoleccionDetalleView, Integer> {
    // Métodos para el historial del donador
    List<RecoleccionDetalleView> findByIdDonador(Integer idDonador);

    // Métodos para el historial de la organización
    List<RecoleccionDetalleView> findByIdOrganizacion(Integer idOrganizacion);

    // Para obtener una recolección por ID con todos sus detalles (útil para la confirmación de entrega)
    Optional<RecoleccionDetalleView> findByIdRecoleccion(Integer idRecoleccion);

    // Métodos para listar todas las recolecciones (para el administrador)
    List<RecoleccionDetalleView> findAll(); // Si necesitas cargar todas con detalles
}