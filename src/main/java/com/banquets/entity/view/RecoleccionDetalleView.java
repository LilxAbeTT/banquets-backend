package com.banquets.entity.view;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;

// Esta entidad mapea la vista V_RECOLECCIONES_DETALLE
// No es para operaciones de escritura (INSERT/UPDATE/DELETE), solo lectura.
@Entity
@Table(name = "V_RECOLECCIONES_DETALLE") // <--- Mapea a la vista SQL
public class RecoleccionDetalleView {

    @Id // La clave primaria de la vista (debe ser única, id_recoleccion lo es)
    @Column(name = "id_recoleccion")
    private Integer idRecoleccion;

    private LocalDateTime fechaAceptacion;
    @Column(name = "recoleccion_estado")
    private String recoleccionEstado; // Para evitar conflicto con donacion_estado
    private String firmaBase64;
    private byte[] comprobanteImagen; // Mapea la imagen binaria

    // Detalles de la Donacion
    @Column(name = "id_donacion")
    private Integer idDonacion;
    @Column(name = "donacion_titulo")
    private String donacionTitulo;
    @Column(name = "donacion_descripcion")
    private String donacionDescripcion;
    @Column(name = "donacion_tipo")
    private String donacionTipo;
    @Column(name = "donacion_categoria")
    private String donacionCategoria;
    @Column(name = "donacion_cantidad")
    private Integer donacionCantidad;
    @Column(name = "donacion_fecha_publicacion")
    private LocalDateTime donacionFechaPublicacion;
    @Column(name = "donacion_fecha_limite")
    private LocalDate donacionFechaLimite;
    @Column(name = "donacion_estado")
    private String donacionEstado;
    @Column(name = "donacion_imagen")
    private byte[] donacionImagen;
    @Column(name = "donacion_latitud")
    private Double donacionLatitud;
    @Column(name = "donacion_longitud")
    private Double donacionLongitud;
    @Column(name = "donacion_empacado")
    private Boolean donacionEmpacado;
    @Column(name = "donacion_estado_comida")
    private String donacionEstadoComida;

    // Detalles del Donador de la Donacion
    @Column(name = "id_donador")
    private Integer idDonador;
    @Column(name = "donador_nombre_empresa")
    private String donadorNombreEmpresa;
    @Column(name = "donador_correo")
    private String donadorCorreo;
    @Column(name = "donador_telefono")
    private String donadorTelefono;

    // Detalles de la Organizacion que recolectó
    @Column(name = "id_organizacion")
    private Integer idOrganizacion;
    @Column(name = "organizacion_nombre_empresa")
    private String organizacionNombreEmpresa;
    @Column(name = "organizacion_correo")
    private String organizacionCorreo;
    @Column(name = "organizacion_telefono")
    private String organizacionTelefono;

    // Detalles de la Evaluación
    @Column(name = "id_evaluacion")
    private Integer idEvaluacion;
    @Column(name = "evaluacion_estrellas")
    private Integer evaluacionEstrellas;
    @Column(name = "evaluacion_comentario")
    private String evaluacionComentario;
    @Column(name = "evaluacion_fecha")
    private LocalDateTime evaluacionFecha;


    // Getters y Setters
    public Integer getIdRecoleccion() { return idRecoleccion; }
    public void setIdRecoleccion(Integer idRecoleccion) { this.idRecoleccion = idRecoleccion; }
    public LocalDateTime getFechaAceptacion() { return fechaAceptacion; }
    public void setFechaAceptacion(LocalDateTime fechaAceptacion) { this.fechaAceptacion = fechaAceptacion; }
    public String getRecoleccionEstado() { return recoleccionEstado; }
    public void setRecoleccionEstado(String recoleccionEstado) { this.recoleccionEstado = recoleccionEstado; }
    public String getFirmaBase64() { return firmaBase64; }
    public void setFirmaBase64(String firmaBase64) { this.firmaBase64 = firmaBase64; }
    public byte[] getComprobanteImagen() { return comprobanteImagen; }
    public void setComprobanteImagen(byte[] comprobanteImagen) { this.comprobanteImagen = comprobanteImagen; }

    public Integer getIdDonacion() { return idDonacion; }
    public void setIdDonacion(Integer idDonacion) { this.idDonacion = idDonacion; }
    public String getDonacionTitulo() { return donacionTitulo; }
    public void setDonacionTitulo(String donacionTitulo) { this.donacionTitulo = donacionTitulo; }
    public String getDonacionDescripcion() { return donacionDescripcion; }
    public void setDonacionDescripcion(String donacionDescripcion) { this.donacionDescripcion = donacionDescripcion; }
    public String getDonacionTipo() { return donacionTipo; }
    public void setDonacionTipo(String donacionTipo) { this.donacionTipo = donacionTipo; }
    public String getDonacionCategoria() { return donacionCategoria; }
    public void setDonacionCategoria(String donacionCategoria) { this.donacionCategoria = donacionCategoria; }
    public Integer getDonacionCantidad() { return donacionCantidad; }
    public void setDonacionCantidad(Integer donacionCantidad) { this.donacionCantidad = donacionCantidad; }
    public LocalDateTime getDonacionFechaPublicacion() { return donacionFechaPublicacion; }
    public void setDonacionFechaPublicacion(LocalDateTime donacionFechaPublicacion) { this.donacionFechaPublicacion = donacionFechaPublicacion; }
    public LocalDate getDonacionFechaLimite() { return donacionFechaLimite; }
    public void setDonacionFechaLimite(LocalDate donacionFechaLimite) { this.donacionFechaLimite = donacionFechaLimite; }
    public String getDonacionEstado() { return donacionEstado; }
    public void setDonacionEstado(String donacionEstado) { this.donacionEstado = donacionEstado; }
    public byte[] getDonacionImagen() { return donacionImagen; }
    public void setDonacionImagen(byte[] donacionImagen) { this.donacionImagen = donacionImagen; }
    public Double getDonacionLatitud() { return donacionLatitud; }
    public void setDonacionLatitud(Double donacionLatitud) { this.donacionLatitud = donacionLatitud; }
    public Double getDonacionLongitud() { return donacionLongitud; }
    public void setDonacionLongitud(Double donacionLongitud) { this.donacionLongitud = donacionLongitud; }
    public Boolean getDonacionEmpacado() { return donacionEmpacado; }
    public void setDonacionEmpacado(Boolean donacionEmpacado) { this.donacionEmpacado = donacionEmpacado; }
    public String getDonacionEstadoComida() { return donacionEstadoComida; }
    public void setDonacionEstadoComida(String donacionEstadoComida) { this.donacionEstadoComida = donacionEstadoComida; }

    public Integer getIdDonador() { return idDonador; }
    public void setIdDonador(Integer idDonador) { this.idDonador = idDonador; }
    public String getDonadorNombreEmpresa() { return donadorNombreEmpresa; }
    public void setDonadorNombreEmpresa(String donadorNombreEmpresa) { this.donadorNombreEmpresa = donadorNombreEmpresa; }
    public String getDonadorCorreo() { return donadorCorreo; }
    public void setDonadorCorreo(String donadorCorreo) { this.donadorCorreo = donadorCorreo; }
    public String getDonadorTelefono() { return donadorTelefono; }
    public void setDonadorTelefono(String donadorTelefono) { this.donadorTelefono = donadorTelefono; }

    public Integer getIdOrganizacion() { return idOrganizacion; }
    public void setIdOrganizacion(Integer idOrganizacion) { this.idOrganizacion = idOrganizacion; }
    public String getOrganizacionNombreEmpresa() { return organizacionNombreEmpresa; }
    public void setOrganizacionNombreEmpresa(String organizacionNombreEmpresa) { this.organizacionNombreEmpresa = organizacionNombreEmpresa; }
    public String getOrganizacionCorreo() { return organizacionCorreo; }
    public void setOrganizacionCorreo(String organizacionCorreo) { this.organizacionCorreo = organizacionCorreo; }
    public String getOrganizacionTelefono() { return organizacionTelefono; }
    public void setOrganizacionTelefono(String organizacionTelefono) { this.organizacionTelefono = organizacionTelefono; }

    public Integer getIdEvaluacion() { return idEvaluacion; }
    public void setIdEvaluacion(Integer idEvaluacion) { this.idEvaluacion = idEvaluacion; }
    public Integer getEvaluacionEstrellas() { return evaluacionEstrellas; }
    public void setEvaluacionEstrellas(Integer evaluacionEstrellas) { this.evaluacionEstrellas = evaluacionEstrellas; }
    public String getEvaluacionComentario() { return evaluacionComentario; }
    public void setEvaluacionComentario(String evaluacionComentario) { this.evaluacionComentario = evaluacionComentario; }
    public LocalDateTime getEvaluacionFecha() { return evaluacionFecha; }
    public void setEvaluacionFecha(LocalDateTime evaluacionFecha) { this.evaluacionFecha = evaluacionFecha; }
}