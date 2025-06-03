// SolicitudIngreso.java
package com.banquets.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "SolicitudIngreso")
public class SolicitudIngreso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idSolicitud;

    @Column(length = 100)
    private String nombre;

    @Column(length = 100)
    private String correo;

    @Column(length = 20)
    private String telefono;

    @Column(length = 20)
    private String tipoUsuario; // 'DONADOR', 'ORGANIZACION'

    @Column(length = 150)
    private String nombreEmpresa;

    @Lob
    private String descripcion;

    @Column(length = 13)
    private String rfc;

    @Column(length = 200)
    private String url;

    @Column(length = 300)
    private String direccion;

    private Double latitud;

    private Double longitud;

    @Lob
    private byte[] comprobantePdf;

    @Column(length = 20)
    private String estado = "pendiente"; // 'pendiente', 'aprobado', 'rechazado'

    private LocalDateTime fecha = LocalDateTime.now();

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Integer getIdSolicitud() {
        return idSolicitud;
    }

    public void setIdSolicitud(Integer idSolicitud) {
        this.idSolicitud = idSolicitud;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getTipoUsuario() {
        return tipoUsuario;
    }

    public void setTipoUsuario(String tipoUsuario) {
        this.tipoUsuario = tipoUsuario;
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

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
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

    public byte[] getComprobantePdf() {
        return comprobantePdf;
    }

    public void setComprobantePdf(byte[] comprobantePdf) {
        this.comprobantePdf = comprobantePdf;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    // Getters y setters
}
