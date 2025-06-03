// DonacionRepository.java
package com.banquets.repository;

import com.banquets.entity.Donacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DonacionRepository extends JpaRepository<Donacion, Integer> {
    List<Donacion> findByDonadorIdDonador(Integer idDonador);
    List<Donacion> findByEstado(String estado);
    List<Donacion> findByDonadorIdDonadorAndEstado(Integer idDonador, String estado);
}
