package com.banquets.dto;

import java.time.LocalDateTime;

public class AceptarDonacionRequestDTO {
    private Integer idDonacion;
    private LocalDateTime fechaEstimadaRecoleccion; // Opcional, si la organización especifica una hora

    // Getters y Setters
    public Integer getIdDonacion() {
        return idDonacion;
    }

    public void setIdDonacion(Integer idDonacion) {
        this.idDonacion = idDonacion;
    }

    public LocalDateTime getFechaEstimadaRecoleccion() {
        return fechaEstimadaRecoleccion;
    }

    public void setFechaEstimadaRecoleccion(LocalDateTime fechaEstimadaRecoleccion) {
        this.fechaEstimadaRecoleccion = fechaEstimadaRecoleccion;
    }
}