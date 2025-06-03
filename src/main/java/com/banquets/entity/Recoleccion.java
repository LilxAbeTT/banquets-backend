// Recoleccion.java
package com.banquets.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Recoleccion")
public class Recoleccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idRecoleccion;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_donacion", nullable = false, unique = true)
    private Donacion donacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_organizacion", nullable = false)
    private Organizacion organizacion;

    private LocalDateTime fechaAceptacion = LocalDateTime.now();

    @Column(length = 20)
    private String estado = "aceptada"; // 'aceptada', 'confirmada'

    @Lob
    private String firmaBase64;

    @Lob
    private String comprobanteImagen;

    public Integer getIdRecoleccion() {
        return idRecoleccion;
    }

    public void setIdRecoleccion(Integer idRecoleccion) {
        this.idRecoleccion = idRecoleccion;
    }

    // Getters y setters
}
