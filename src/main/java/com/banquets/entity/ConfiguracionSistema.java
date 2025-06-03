// ConfiguracionSistema.java
package com.banquets.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ConfiguracionSistema")
public class ConfiguracionSistema {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idConfiguracion;

    private Integer diasMaximosRecojo = 2;

    @Column(length = 300)
    private String mensajeGlobal;

    private Boolean activarMantenimiento = false;

    @Column(length = 300)
    private String notificacionEmergente;

    // Getters y setters
}
