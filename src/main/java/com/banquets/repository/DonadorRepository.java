// DonadorRepository.java
package com.banquets.repository;

import com.banquets.entity.Donador;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DonadorRepository extends JpaRepository<Donador, Integer> {
    Optional<Donador> findByUsuarioIdUsuario(Integer idUsuario);
}
