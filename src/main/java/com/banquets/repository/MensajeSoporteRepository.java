// MensajeSoporteRepository.java
package com.banquets.repository;

import com.banquets.entity.MensajeSoporte;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MensajeSoporteRepository extends JpaRepository<MensajeSoporte, Integer> {
    List<MensajeSoporte> findByRespondidoFalse();
    long countByEstado(String estado);

}
