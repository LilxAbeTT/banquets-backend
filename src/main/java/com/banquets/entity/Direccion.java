// Direccion.java
package com.banquets.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Direccion")
public class Direccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idDireccion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(length = 300)
    private String direccion;

    private Double latitud;

    private Double longitud;

    // Getters y setters
}
