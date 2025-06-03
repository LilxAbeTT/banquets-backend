// Organizacion.java
package com.banquets.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Organizacion")
public class Organizacion {
    @Id
    private Integer idOrganizacion;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id_organizacion")
    private Usuario usuario;

    @Column(length = 150)
    private String nombreEmpresa;


    @Lob
    private String descripcion;

    public Integer getIdOrganizacion() {
        return idOrganizacion;
    }

    public void setIdOrganizacion(Integer idOrganizacion) {
        this.idOrganizacion = idOrganizacion;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getNombreEmpresa() {
        return nombreEmpresa;
    }

    public void setNombreEmpresa(String nombreEmpresa) {
        this.nombreEmpresa = nombreEmpresa;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    // Getters y setters
}
