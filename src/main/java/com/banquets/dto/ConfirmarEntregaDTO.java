package com.banquets.dto;

public class ConfirmarEntregaDTO {
    private Integer idRecoleccion;
    private String firmaBase64;
    private String comprobanteBase64; // Se convierte a binario en backend

    public Integer getIdRecoleccion() {
        return idRecoleccion;
    }

    public void setIdRecoleccion(Integer idRecoleccion) {
        this.idRecoleccion = idRecoleccion;
    }

    public String getFirmaBase64() {
        return firmaBase64;
    }

    public void setFirmaBase64(String firmaBase64) {
        this.firmaBase64 = firmaBase64;
    }

    public String getComprobanteBase64() {
        return comprobanteBase64;
    }

    public void setComprobanteBase64(String comprobanteBase64) {
        this.comprobanteBase64 = comprobanteBase64;
    }
}
