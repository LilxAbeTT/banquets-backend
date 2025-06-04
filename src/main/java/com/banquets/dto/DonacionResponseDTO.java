package com.banquets.dto;

import com.banquets.entity.Donacion;
import com.banquets.entity.Donador;
import com.banquets.entity.Recoleccion; // Posiblemente necesites esta importación si la usas en el DTO
import com.banquets.entity.Organizacion; // Si Recoleccion incluye Organizacion

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Base64; // Importa la clase Base64 para codificación

public class DonacionResponseDTO {

    private Integer idDonacion;
    private String titulo;
    private String descripcion;
    private String tipo;
    private String categoria;
    private Integer cantidad;
    private LocalDateTime fechaPublicacion;
    private LocalDate fechaLimite;
    private String estado; // Estado de la donación
    private String imagenBase64; // La imagen codificada en Base64 para el frontend
    private Double latitud;
    private Double longitud;
    private Boolean empacado;
    private String estadoComida;

    // Puedes incluir información del Donador si el frontend la necesita en la tarjeta
    private Integer idDonador;
    private String nombreDonadorEmpresa;

    // Si la donación tiene una recolección asociada, puedes incluir información clave de ella
    private Integer idRecoleccionAsociada;
    private String estadoRecoleccionAsociada; // Por ejemplo, 'aceptada', 'confirmada'
    private String firmaBase64Recoleccion; // Si necesitas mostrar la firma desde el DashboardDonador

    // Constructor que toma la entidad Donacion y la convierte a DTO
    public DonacionResponseDTO(Donacion donacion) {
        this.idDonacion = donacion.getIdDonacion();
        this.titulo = donacion.getTitulo();
        this.descripcion = donacion.getDescripcion();
        this.tipo = donacion.getTipo();
        this.categoria = donacion.getCategoria();
        this.cantidad = donacion.getCantidad();
        this.fechaPublicacion = donacion.getFechaPublicacion();
        this.fechaLimite = donacion.getFechaLimite();
        this.estado = donacion.getEstado();
        this.latitud = donacion.getLatitud();
        this.longitud = donacion.getLongitud();
        this.empacado = donacion.getEmpacado();
        this.estadoComida = donacion.getEstadoComida();

        // Codificar la imagen byte[] a Base64 String
        if (donacion.getImagen() != null) {
            this.imagenBase64 = Base64.getEncoder().encodeToString(donacion.getImagen());
        }

        // Información del donador
        if (donacion.getDonador() != null) {
            this.idDonador = donacion.getDonador().getIdDonador();
            this.nombreDonadorEmpresa = donacion.getDonador().getNombreEmpresa();
        }

        // Si la entidad Donacion tuviera una relación a Recoleccion (OneToOne), podrías mapearla aquí.
        // Dado que Recoleccion tiene una FK a Donacion, necesitarías cargar la Recoleccion asociada
        // si quieres mostrar su estado o firma desde el DTO de Donacion.
        // Esto podría implicar una consulta adicional en el servicio si no estás usando fetch EAGER
        // o un DTO más complejo. Por ahora, solo mapearemos lo que está en la Donacion.
        // Si más adelante decides mapear Recoleccion en Donacion, actualiza aquí.
        // Ejemplo si Donacion tiene OneToOne a Recoleccion:
        // if (donacion.getRecoleccionAsociada() != null) {
        //     this.idRecoleccionAsociada = donacion.getRecoleccionAsociada().getIdRecoleccion();
        //     this.estadoRecoleccionAsociada = donacion.getRecoleccionAsociada().getEstado();
        //     if (donacion.getRecoleccionAsociada().getFirmaBase64() != null) {
        //         this.firmaBase64Recoleccion = donacion.getRecoleccionAsociada().getFirmaBase64();
        //     }
        // }
    }

    // --- Getters y Setters ---

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

    public LocalDateTime getFechaPublicacion() {
        return fechaPublicacion;
    }

    public void setFechaPublicacion(LocalDateTime fechaPublicacion) {
        this.fechaPublicacion = fechaPublicacion;
    }

    public LocalDate getFechaLimite() {
        return fechaLimite;
    }

    public void setFechaLimite(LocalDate fechaLimite) {
        this.fechaLimite = fechaLimite;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getImagenBase64() {
        return imagenBase64;
    }

    public void setImagenBase64(String imagenBase64) {
        this.imagenBase64 = imagenBase64;
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

    public Boolean getEmpacado() {
        return empacado;
    }

    public void setEmpacado(Boolean empacado) {
        this.empacado = empacado;
    }

    public String getEstadoComida() {
        return estadoComida;
    }

    public void setEstadoComida(String estadoComida) {
        this.estadoComida = estadoComida;
    }

    public Integer getIdDonador() {
        return idDonador;
    }

    public void setIdDonador(Integer idDonador) {
        this.idDonador = idDonador;
    }

    public String getNombreDonadorEmpresa() {
        return nombreDonadorEmpresa;
    }

    public void setNombreDonadorEmpresa(String nombreDonadorEmpresa) {
        this.nombreDonadorEmpresa = nombreDonadorEmpresa;
    }

    public Integer getIdRecoleccionAsociada() {
        return idRecoleccionAsociada;
    }

    public void setIdRecoleccionAsociada(Integer idRecoleccionAsociada) {
        this.idRecoleccionAsociada = idRecoleccionAsociada;
    }

    public String getEstadoRecoleccionAsociada() {
        return estadoRecoleccionAsociada;
    }

    public void setEstadoRecoleccionAsociada(String estadoRecoleccionAsociada) {
        this.estadoRecoleccionAsociada = estadoRecoleccionAsociada;
    }

    public String getFirmaBase64Recoleccion() {
        return firmaBase64Recoleccion;
    }

    public void setFirmaBase64Recoleccion(String firmaBase64Recoleccion) {
        this.firmaBase64Recoleccion = firmaBase64Recoleccion;
    }
}