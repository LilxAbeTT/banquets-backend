// Donador.java
package com.banquets.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Donador")
public class Donador {
    @Id
    private Integer idDonador;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id_donador")
    private Usuario usuario;

    @Column(length = 150)
    private String nombreEmpresa;

    @Lob
    private String descripcion;

    @Column(length = 13)
    private String rfc;

    @Column(length = 200)
    private String url;

    public Integer getIdDonador() {
        return idDonador;
    }

    public void setIdDonador(Integer idDonador) {
        this.idDonador = idDonador;
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

    public String getRfc() {
        return rfc;
    }

    public void setRfc(String rfc) {
        this.rfc = rfc;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    // Getters y setters
}
