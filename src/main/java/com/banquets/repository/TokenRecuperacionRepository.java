package com.banquets.repository;

import com.banquets.entity.TokenRecuperacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TokenRecuperacionRepository extends JpaRepository<TokenRecuperacion, Integer> {
    Optional<TokenRecuperacion> findByToken(String token);
    void deleteByCorreo(String correo); // para limpiar previos si deseas
}
