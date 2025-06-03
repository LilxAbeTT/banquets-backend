// RecoleccionRepository.java
package com.banquets.repository;

import com.banquets.entity.Recoleccion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecoleccionRepository extends JpaRepository<Recoleccion, Integer> {
    List<Recoleccion> findByOrganizacionIdOrganizacion(Integer idOrganizacion);
    List<Recoleccion> findByDonacionDonadorIdDonador(Integer idDonador);
}
