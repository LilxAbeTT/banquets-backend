// Donacion.java
package com.banquets.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "Donacion")
public class Donacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idDonacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_donador", nullable = false)
    private Donador donador;

    @Column(length = 150)
    private String titulo;

    @Lob
    private String descripcion;

    @Column(length = 100)
    private String tipo;

    @Column(length = 20)
    private String categoria; // 'humano' o 'animal'

    private Integer cantidad;

    private LocalDateTime fechaPublicacion = LocalDateTime.now();

    private LocalDate fechaLimite;

    @Column(length = 20)
    private String estado = "pendientes"; // 'pendientes', 'en_proceso', 'recolectadas'

    @Lob
    private String imagen;

    private Double latitud;

    private Double longitud;

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public Integer getIdDonacion() {
        return idDonacion;
    }

    public void setIdDonacion(Integer idDonacion) {
        this.idDonacion = idDonacion;
    }

    // Getters y setters
}
