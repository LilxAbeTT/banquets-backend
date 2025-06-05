package com.banquets.dto;

public class LoginResponse {
    private String token;
    private String tipoUsuario;
    private String nombre;
    private Integer idUsuario;
    private Double latitud;
    private Double longitud;

    // Constructor actualizado
    public LoginResponse(String token, String tipoUsuario, String nombre, Integer idUsuario, Double latitud, Double longitud) {
        this.token = token;
        this.tipoUsuario = tipoUsuario;
        this.nombre = nombre;
        this.idUsuario = idUsuario;
        this.latitud = latitud;
        this.longitud = longitud;
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

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public Double getLatitud() {
        return latitud;
    }

    public Double getLongitud() {
        return longitud;
    }
}