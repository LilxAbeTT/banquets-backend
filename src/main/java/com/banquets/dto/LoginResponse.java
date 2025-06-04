package com.banquets.dto;

public class LoginResponse {
    private String token;
    private String tipoUsuario;
    private String nombre;
    private Integer idUsuario; // <--- Añadir este campo

    public LoginResponse(String token, String tipoUsuario, String nombre, Integer idUsuario) { // <--- Modificar constructor
        this.token = token;
        this.tipoUsuario = tipoUsuario;
        this.nombre = nombre;
        this.idUsuario = idUsuario; // <--- Asignar
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

    public Integer getIdUsuario() { // <--- Añadir getter
        return idUsuario;
    }
}