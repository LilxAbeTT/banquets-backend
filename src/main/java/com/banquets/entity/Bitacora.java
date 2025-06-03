// Bitacora.java
package com.banquets.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Bitacora")
public class Bitacora {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idBitacora;

    @Column(length = 100)
    private String usuario;

    @Column(length = 300)
    private String accion;

    @Column(length = 20)
    private String tipo;

    private LocalDateTime fecha = LocalDateTime.now();

    // Getters y setters
}
