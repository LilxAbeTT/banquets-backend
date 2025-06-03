package com.banquets.dto;

public class LoginResponse {
    private String token;
    private String tipoUsuario;
    private String nombre;

    public LoginResponse(String token, String tipoUsuario, String nombre) {
        this.token = token;
        this.tipoUsuario = tipoUsuario;
        this.nombre = nombre;
    }

    // Getters
    public String getToken() {
        return token;
    }

    public String getTipoUsuario() {
        return tipoUsuario;
    }

    public String getNombre() {
        return nombre;
    }
}
