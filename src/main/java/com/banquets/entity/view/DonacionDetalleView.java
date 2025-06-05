package com.banquets.entity.view;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;

// Esta entidad mapea la vista V_DONACIONES_DETALLE
// No es para operaciones de escritura (INSERT/UPDATE/DELETE), solo lectura.
@Entity
@Table(name = "V_DONACIONES_DETALLE") // <--- Mapea a la vista SQL
public class DonacionDetalleView {

    @Id // La clave primaria de la vista (debe ser única, id_donacion lo es)
    @Column(name = "id_donacion")
    private Integer idDonacion;

    private String titulo;
    private String descripcion;
    private String tipo;
    private String categoria;
    private Integer cantidad;
    private LocalDateTime fechaPublicacion;
    private LocalDate fechaLimite;
    private String estado;
    private byte[] imagen; // Mapea la imagen binaria (VARBINARY(MAX) en DB)
    private Double latitud;
    private Double longitud;
    private Boolean empacado;
    @Column(name = "estado_comida")
    private String estadoComida;

    // Datos del Donador (desde la vista)
    @Column(name = "id_donador")
    private Integer idDonador;
    @Column(name = "donador_nombre_empresa")
    private String donadorNombreEmpresa;
    @Column(name = "donador_correo")
    private String donadorCorreo;
    @Column(name = "donador_telefono")
    private String donadorTelefono;


    // Getters y Setters (solo los que necesites para acceder a los datos)
    public Integer getIdDonacion() { return idDonacion; }
    public void setIdDonacion(Integer idDonacion) { this.idDonacion = idDonacion; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    public LocalDateTime getFechaPublicacion() { return fechaPublicacion; }
    public void setFechaPublicacion(LocalDateTime fechaPublicacion) { this.fechaPublicacion = fechaPublicacion; }
    public LocalDate getFechaLimite() { return fechaLimite; }
    public void setFechaLimite(LocalDate fechaLimite) { this.fechaLimite = fechaLimite; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public byte[] getImagen() { return imagen; }
    public void setImagen(byte[] imagen) { this.imagen = imagen; }
    public Double getLatitud() { return latitud; }
    public void setLatitud(Double latitud) { this.latitud = latitud; }
    public Double getLongitud() { return longitud; }
    public void setLongitud(Double longitud) { this.longitud = longitud; }
    public Boolean getEmpacado() { return empacado; }
    public void setEmpacado(Boolean empacado) { this.empacado = empacado; }
    public String getEstadoComida() { return estadoComida; }
    public void setEstadoComida(String estadoComida) { this.estadoComida = estadoComida; }
    public Integer getIdDonador() { return idDonador; }
    public void setIdDonador(Integer idDonador) { this.idDonador = idDonador; }
    public String getDonadorNombreEmpresa() { return donadorNombreEmpresa; }
    public void setDonadorNombreEmpresa(String donadorNombreEmpresa) { this.donadorNombreEmpresa = donadorNombreEmpresa; }
    public String getDonadorCorreo() { return donadorCorreo; }
    public void setDonadorCorreo(String donadorCorreo) { this.donadorCorreo = donadorCorreo; }
    public String getDonadorTelefono() { return donadorTelefono; }
    public void setDonadorTelefono(String donadorTelefono) { this.donadorTelefono = donadorTelefono; }
}