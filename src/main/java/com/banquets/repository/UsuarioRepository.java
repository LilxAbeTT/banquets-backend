package com.banquets.repository;

import com.banquets.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // <-- Importar Query
import org.springframework.data.repository.query.Param; // <-- Importar Param

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByCorreo(String correo);

    // Nuevo método para cargar el usuario Y sus direcciones en una sola consulta
    @Query("SELECT u FROM Usuario u LEFT JOIN FETCH u.direcciones d WHERE u.correo = :correo")
    Optional<Usuario> findByCorreoFetchDirecciones(@Param("correo") String correo);
}