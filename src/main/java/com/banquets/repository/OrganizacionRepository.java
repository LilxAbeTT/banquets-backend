// OrganizacionRepository.java
package com.banquets.repository;

import com.banquets.entity.Organizacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OrganizacionRepository extends JpaRepository<Organizacion, Integer> {
    Optional<Organizacion> findByUsuarioIdUsuario(Integer idUsuario);
}
