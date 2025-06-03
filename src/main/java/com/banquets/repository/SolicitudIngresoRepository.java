// SolicitudIngresoRepository.java
package com.banquets.repository;

import com.banquets.entity.SolicitudIngreso;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SolicitudIngresoRepository extends JpaRepository<SolicitudIngreso, Integer> {
    List<SolicitudIngreso> findByEstado(String estado);

    int countByEstado(String estado);
}
