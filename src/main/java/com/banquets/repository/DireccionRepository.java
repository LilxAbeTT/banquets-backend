package com.banquets.repository;

import com.banquets.entity.Direccion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DireccionRepository extends JpaRepository<Direccion, Integer> {
    List<Direccion> findByUsuarioIdUsuario(Integer idUsuario); // <--- Este método es útil para el AuthService
}