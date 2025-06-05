package com.banquets.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Recoleccion")
public class Recoleccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idRecoleccion;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_donacion", nullable = false, unique = true)
    private Donacion donacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_organizacion", nullable = false)
    private Organizacion organizacion;

    private LocalDateTime fechaAceptacion = LocalDateTime.now();

    @Column(length = 20)
    private String estado = "aceptada"; // 'aceptada', 'confirmada', 'cancelada'

    @Lob // Para almacenar la firma como String Base64 directamente
    private String firmaBase64;

    @Lob // PARA ALMACENAR LA IMAGEN BINARIA DESDE DB (VARBINARY(MAX))
    private byte[] comprobanteImagen; // <--- CAMBIO AQUÍ: de String a byte[]

    public Integer getIdRecoleccion() {
        return idRecoleccion;
    }

    public void setIdRecoleccion(Integer idRecoleccion) {
        this.idRecoleccion = idRecoleccion;
    }

    public Donacion getDonacion() {
        return donacion;
    }

    public void setDonacion(Donacion donacion) {
        this.donacion = donacion;
    }

    public Organizacion getOrganizacion() {
        return organizacion;
    }

    public void setOrganizacion(Organizacion organizacion) {
        this.organizacion = organizacion;
    }

    public LocalDateTime getFechaAceptacion() {
        return fechaAceptacion;
    }

    public void setFechaAceptacion(LocalDateTime fechaAceptacion) {
        this.fechaAceptacion = fechaAceptacion;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getFirmaBase64() {
        return firmaBase64;
    }

    public void setFirmaBase64(String firmaBase64) {
        this.firmaBase64 = firmaBase64;
    }

    // GETTER Y SETTER PARA EL NUEVO TIPO DE DATO DE COMPROBANTEIMAGEN
    public byte[] getComprobanteImagen() { // <--- CAMBIO AQUÍ
        return comprobanteImagen;
    }

    public void setComprobanteImagen(byte[] comprobanteImagen) { // <--- CAMBIO AQUÍ
        this.comprobanteImagen = comprobanteImagen;
    }
}