// EvaluacionRepository.java
package com.banquets.repository;

import com.banquets.entity.Evaluacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EvaluacionRepository extends JpaRepository<Evaluacion, Integer> {
    List<Evaluacion> findByRecoleccionOrganizacionIdOrganizacion(Integer idOrganizacion);
    List<Evaluacion> findByRecoleccionDonacionDonadorIdDonador(Integer idDonador);
}
