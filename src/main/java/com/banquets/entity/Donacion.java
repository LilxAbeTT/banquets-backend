package com.banquets.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "Donacion")
public class Donacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idDonacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_donador", nullable = false)
    private Donador donador;

    @Column(length = 150)
    private String titulo;

    @Lob // Usado para String muy largos o byte[]
    private String descripcion;

    @Column(length = 100)
    private String tipo;

    @Column(length = 20)
    private String categoria; // 'humano' o 'animal'

    private Integer cantidad;

    private LocalDateTime fechaPublicacion = LocalDateTime.now();

    private LocalDate fechaLimite;

    @Column(length = 20)
    private String estado = "pendientes"; // 'pendientes', 'en_proceso', 'recolectadas'

    @Lob // Para almacenar la imagen como String Base64 o byte[]
    private byte[] imagen;
    private Double latitud;

    private Double longitud;

    // --- CAMPOS NUEVOS ---
    private Boolean empacado; // <--- Añadido este campo
    @Column(name = "estado_comida", length = 50) // <--- Añadido este campo, con @Column para mapeo exacto
    private String estadoComida;
    // --- FIN CAMPOS NUEVOS ---

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public Integer getIdDonacion() {
        return idDonacion;
    }

    public void setIdDonacion(Integer idDonacion) {
        this.idDonacion = idDonacion;
    }

    public Donador getDonador() {
        return donador;
    }

    public void setDonador(Donador donador) {
        this.donador = donador;
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

    // Nota importante: Si 'imagen' en la DB es VARBINARY(MAX), el tipo en Java debería ser byte[]
    // Si la DB es NVARCHAR(MAX) y guardas un Base64, entonces String está bien.
    // En el último script SQL que te di, la definí como VARBINARY(MAX).
    // Si tu DB es VARBINARY(MAX), cambia 'private String imagen;' a 'private byte[] imagen;'
    // y sus getters/setters.
    public byte[] getImagen() { return imagen; }

    public void setImagen(byte[] imagen) { this.imagen = imagen; }

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

    // --- GETTERS Y SETTERS PARA LOS NUEVOS CAMPOS ---
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
    // --- FIN GETTERS Y SETTERS ---
}