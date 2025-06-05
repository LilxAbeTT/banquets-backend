package com.banquets.repository;

import com.banquets.entity.Donacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // <--- Importar
import org.springframework.data.repository.query.Param; // <--- Importar
import java.util.List;
import java.util.Optional; // <--- Importar si no está

public interface DonacionRepository extends JpaRepository<Donacion, Integer> {
    // Carga las donaciones de un donador y el objeto Donador asociado
    @Query("SELECT d FROM Donacion d JOIN FETCH d.donador don WHERE don.idDonador = :idDonador")
    List<Donacion> findByDonadorIdDonador(@Param("idDonador") Integer idDonador);

    // Carga las donaciones de un donador por estado y el objeto Donador asociado
    @Query("SELECT d FROM Donacion d JOIN FETCH d.donador don WHERE don.idDonador = :idDonador AND d.estado = :estado")
    List<Donacion> findByDonadorIdDonadorAndEstado(@Param("idDonador") Integer idDonador, @Param("estado") String estado);

    // Carga todas las donaciones por estado y el objeto Donador asociado
    @Query("SELECT d FROM Donacion d JOIN FETCH d.donador WHERE d.estado = :estado")
    List<Donacion> findByEstado(@Param("estado") String estado);

    // Para obtener una donación por ID y el donador asociado
    @Query("SELECT d FROM Donacion d JOIN FETCH d.donador WHERE d.idDonacion = :idDonacion")
    Optional<Donacion> findByIdFetchDonador(@Param("idDonacion") Integer idDonacion);
}