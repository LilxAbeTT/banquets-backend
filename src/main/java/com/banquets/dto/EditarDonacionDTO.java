package com.banquets.dto;

import java.util.Date;

public class EditarDonacionDTO {
    private Integer idDonacion;
    private String titulo;
    private String descripcion;
    private String tipo;
    private String categoria;
    private Integer cantidad;
    private Date fechaLimite;
    private String estadoComida;
    private Boolean empacado;
    private Double latitud;
    private Double longitud;

    public Integer getIdDonacion() {
        return idDonacion;
    }

    public void setIdDonacion(Integer idDonacion) {
        this.idDonacion = idDonacion;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public Date getFechaLimite() {
        return fechaLimite;
    }

    public void setFechaLimite(Date fechaLimite) {
        this.fechaLimite = fechaLimite;
    }

    public String getEstadoComida() {
        return estadoComida;
    }

    public void setEstadoComida(String estadoComida) {
        this.estadoComida = estadoComida;
    }

    public Boolean getEmpacado() {
        return empacado;
    }

    public void setEmpacado(Boolean empacado) {
        this.empacado = empacado;
    }

    public Double getLatitud() {
        return latitud;
    }

    public void setLatitud(Double latitud) {
        this.latitud = latitud;
    }

    public Double getLongitud() {
        return longitud;
    }

    public void setLongitud(Double longitud) {
        this.longitud = longitud;
    }
}
