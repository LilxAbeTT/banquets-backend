package com.banquets.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idUsuario;

    @Column(length = 100)
    private String nombre;

    @Column(length = 100, unique = true, nullable = false)
    private String correo;

    @Column(length = 20)
    private String telefono;

    @Column(length = 20, nullable = false)
    private String tipoUsuario;  // 'DONADOR', 'ORGANIZACION', 'ADMIN'

    @Column(length = 200)
    private String contrasena;

    // --- CAMBIO AQUÍ: 'estado' a Boolean ---
    // Mapea a BIT en la base de datos. Asegúrate que en tu DB sea BIT NOT NULL DEFAULT 1.
    @Column(name = "estado", nullable = false)
    private Boolean estado = true; // Valor por defecto true para activo
    // --- FIN CAMBIO ---

    private LocalDateTime fechaUltimoLogin;

    private Integer intentosFallidos = 0;

    // Relaciones
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Direccion> direcciones;

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private Donador donador;

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private Organizacion organizacion;

    // Getters y setters (asegúrate de que estén todos para los demás campos también)
    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getTipoUsuario() { return tipoUsuario; }
    public void setTipoUsuario(String tipoUsuario) { this.tipoUsuario = tipoUsuario; }
    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }

    // --- CAMBIO AQUÍ: Get/Set para Boolean estado ---
    public Boolean getEstado() { return estado; }
    public void setEstado(Boolean estado) { this.estado = estado; }
    // --- FIN CAMBIO ---

    public LocalDateTime getFechaUltimoLogin() { return fechaUltimoLogin; }
    public void setFechaUltimoLogin(LocalDateTime fechaUltimoLogin) { this.fechaUltimoLogin = fechaUltimoLogin; }
    public Integer getIntentosFallidos() { return intentosFallidos; }
    public void setIntentosFallidos(Integer intentosFallidos) { this.intentosFallidos = intentosFallidos; }
    public List<Direccion> getDirecciones() { return direcciones; }
    public void setDirecciones(List<Direccion> direcciones) { this.direcciones = direcciones; }
    public Donador getDonador() { return donador; }
    public void setDonador(Donador donador) { this.donador = donador; }
    public Organizacion getOrganizacion() { return organizacion; }
    public void setOrganizacion(Organizacion organizacion) { this.organizacion = organizacion; }
}