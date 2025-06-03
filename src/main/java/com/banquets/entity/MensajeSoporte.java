// MensajeSoporte.java
package com.banquets.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "MensajeSoporte")
public class MensajeSoporte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idMensaje;

    @Column(length = 100)
    private String correoUsuario;

    @Column(length = 20)
    private String tipo; // 'pregunta', 'respuesta'

    @Lob
    private String mensaje;

    @Column(nullable = false)
    private String estado;  // por ejemplo: "pendiente", "respondido"


    private Boolean respondido = false;

    private LocalDateTime fecha = LocalDateTime.now();

    public Boolean getRespondido() {
        return respondido;
    }

    public void setRespondido(Boolean respondido) {
        this.respondido = respondido;
    }

    public Integer getIdMensaje() {
        return idMensaje;
    }

    public void setIdMensaje(Integer idMensaje) {
        this.idMensaje = idMensaje;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}
