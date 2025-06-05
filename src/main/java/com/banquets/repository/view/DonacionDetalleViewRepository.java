package com.banquets.repository.view;

import com.banquets.entity.view.DonacionDetalleView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DonacionDetalleViewRepository extends JpaRepository<DonacionDetalleView, Integer> {
    // Métodos de consulta personalizados para la vista
    List<DonacionDetalleView> findByIdDonador(Integer idDonador);
    List<DonacionDetalleView> findByEstado(String estado);
    List<DonacionDetalleView> findByIdDonadorAndEstado(Integer idDonador, String estado);
    Optional<DonacionDetalleView> findByIdDonacion(Integer idDonacion); // Para obtener detalles de una sola donación
}