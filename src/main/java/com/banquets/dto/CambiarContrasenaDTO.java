package com.banquets.dto;

public class CambiarContrasenaDTO {
    private Integer idUsuario;
    private String contrasenaActual;
    private String nuevaContrasena;

    // Getters y setters
    public Integer getIdUsuario() {
        return idUsuario;
    }
    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }
    public String getContrasenaActual() {
        return contrasenaActual;
    }
    public void setContrasenaActual(String contrasenaActual) {
        this.contrasenaActual = contrasenaActual;
    }
    public String getNuevaContrasena() {
        return nuevaContrasena;
    }
    public void setNuevaContrasena(String nuevaContrasena) {
        this.nuevaContrasena = nuevaContrasena;
    }
}
