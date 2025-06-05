package com.banquets.dto;

import com.banquets.entity.Donacion;
import com.banquets.entity.Donador;
import com.banquets.entity.Organizacion;
import com.banquets.entity.Recoleccion;
import com.banquets.entity.Usuario; // Necesario para DonadorDTO/OrganizacionDTO desde entidad
import com.banquets.entity.view.DonacionDetalleView;
import com.banquets.entity.view.RecoleccionDetalleView;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List; // Necesario para Direccion en UsuarioDTO

public class DonacionResponseDTO {
    private Integer idDonacion;
    private String titulo;
    private String descripcion;
    private String tipo;
    private String categoria;
    private Integer cantidad;
    private LocalDateTime fechaPublicacion;
    private LocalDate fechaLimite;
    private String estado;
    private String imagenBase64;
    private Double latitud;
    private Double longitud;
    private Boolean empacado;
    private String estadoComida;

    private DonadorDTO donador;
    private RecoleccionDTO recoleccion;

    // Constructor desde DonacionDetalleView (para listar donaciones)
    public DonacionResponseDTO(
            Integer idDonacion, String titulo, String descripcion,
            String tipo, String categoria, Integer cantidad,
            LocalDateTime fechaPublicacion, LocalDate fechaLimite, String estado,
            String imagenBase64, Double latitud, Double longitud,
            Boolean empacado, String estadoComida,
            Integer idDonador, String donadorNombreEmpresa, String donadorCorreo, String donadorTelefono
    ) {
        this.idDonacion = idDonacion;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.tipo = tipo;
        this.categoria = categoria;
        this.cantidad = cantidad;
        this.fechaPublicacion = fechaPublicacion;
        this.fechaLimite = fechaLimite;
        this.estado = estado;
        this.imagenBase64 = imagenBase64;
        this.latitud = latitud;
        this.longitud = longitud;
        this.empacado = empacado;
        this.estadoComida = estadoComida;
        this.donador = new DonadorDTO(idDonador, donadorNombreEmpresa, donadorCorreo, donadorTelefono);
    }

    // Constructor desde ENTIDAD Donacion (para crear/actualizar).
    // Aquí el Donador (relación ManyToOne) debería estar cargado.
    // Evitaremos acceder a relaciones LAZY como Usuario.direcciones.
    public DonacionResponseDTO(Donacion donacion) {
        this.idDonacion = donacion.getIdDonacion();
        this.titulo = donacion.getTitulo();
        this.descripcion = donacion.getDescripcion();
        this.tipo = donacion.getTipo();
        this.categoria = donacion.getCategoria();
        this.cantidad = donacion.getCantidad();
        this.fechaPublicacion = donacion.getFechaPublicacion();
        this.fechaLimite = donacion.getFechaLimite();
        this.estado = donacion.getEstado();
        this.latitud = donacion.getLatitud();
        this.longitud = donacion.getLongitud();
        this.empacado = donacion.getEmpacado();
        this.estadoComida = donacion.getEstadoComida();

        if (donacion.getImagen() != null && donacion.getImagen().length > 0) {
            this.imagenBase64 = Base64.getEncoder().encodeToString(donacion.getImagen());
        }

        // Mapeo del Donador asociado a la Donacion (si está cargado)
        if (donacion.getDonador() != null) {
            // Asegúrate que el Donador.getUsuario() no se use si es LAZY, o si lo haces, que cargue con JOIN FETCH.
            // O pasa solo la info del Donador que es EAGER (nombreEmpresa, descripcion, rfc, url)
            this.donador = new DonadorDTO(donacion.getDonador().getIdDonador(),
                    donacion.getDonador().getNombreEmpresa(),
                    null, // No intentamos obtener correo/telefono directamente si Usuario es LAZY
                    null);
        }
    }

    // Getters y Setters
    // ... (asegúrate de que todos los getters y setters estén aquí)
    public Integer getIdDonacion() { return idDonacion; }
    public void setIdDonacion(Integer idDonacion) { this.idDonacion = idDonacion; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    public LocalDateTime getFechaPublicacion() { return fechaPublicacion; }
    public void setFechaPublicacion(LocalDateTime fechaPublicacion) { this.fechaPublicacion = fechaPublicacion; }
    public LocalDate getFechaLimite() { return fechaLimite; }
    public void setFechaLimite(LocalDate fechaLimite) { this.fechaLimite = fechaLimite; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getImagenBase64() { return imagenBase64; }
    public void setImagenBase64(String imagenBase64) { this.imagenBase64 = imagenBase64; }
    public Double getLatitud() { return latitud; }
    public void setLatitud(Double latitud) { this.latitud = latitud; }
    public Double getLongitud() { return longitud; }
    public void setLongitud(Double longitud) { this.longitud = longitud; }
    public Boolean getEmpacado() { return empacado; }
    public void setEmpacado(Boolean empacado) { this.empacado = empacado; }
    public String getEstadoComida() { return estadoComida; }
    public void setEstadoComida(String estadoComida) { this.estadoComida = estadoComida; }
    public DonadorDTO getDonador() { return donador; }
    public void setDonador(DonadorDTO donador) { this.donador = donador; }
    public RecoleccionDTO getRecoleccion() { return recoleccion; }
    public void setRecoleccion(RecoleccionDTO recoleccion) { this.recoleccion = recoleccion; }


    // DTO anidado para Donador
    public static class DonadorDTO {
        private Integer idDonador;
        private String nombreEmpresa;
        private String correo;
        private String telefono;

        // Constructor desde entidad Donador
        public DonadorDTO(Donador donador) {
            this.idDonador = donador.getIdDonador();
            this.nombreEmpresa = donador.getNombreEmpresa();
            // Evita acceder a usuario.getCorreo()/getTelefono() si Usuario es LAZY y no se cargó EAGERLY aquí.
            // Si la relación Donador.usuario es LAZY, esto daría LazyInitException.
            // Si siempre se carga con JOIN FETCH, entonces sí puedes acceder.
            // Para seguridad, podrías no incluir estos campos o añadir null checks.
            if (donador.getUsuario() != null) { // Si el usuario está cargado (EAGER o JOIN FETCH)
                this.correo = donador.getUsuario().getCorreo();
                this.telefono = donador.getUsuario().getTelefono();
            }
        }
        // Constructor para usar con VISTAS, que no tienen objetos anidados sino campos planos
        public DonadorDTO(Integer idDonador, String nombreEmpresa, String correo, String telefono) {
            this.idDonador = idDonador;
            this.nombreEmpresa = nombreEmpresa;
            this.correo = correo;
            this.telefono = telefono;
        }

        // Getters y Setters
        public Integer getIdDonador() { return idDonador; }
        public void setIdDonador(Integer idDonador) { this.idDonador = idDonador; }
        public String getNombreEmpresa() { return nombreEmpresa; }
        public void setNombreEmpresa(String nombreEmpresa) { this.nombreEmpresa = nombreEmpresa; }
        public String getCorreo() { return correo; }
        public void setCorreo(String correo) { this.correo = correo; }
        public String getTelefono() { return telefono; }
        public void setTelefono(String telefono) { this.telefono = telefono; }
    }

    // DTO anidado para Recoleccion
    public static class RecoleccionDTO {
        private Integer idRecoleccion;
        private LocalDateTime fechaAceptacion;
        private String estado; // RecoleccionEstado
        private String firmaBase64;
        private String comprobanteImagenBase64;

        // Datos de la Donacion anidada (para historial)
        private Integer idDonacion;
        private String donacionTitulo;
        private String donacionDescripcion;
        private String donacionTipo;
        private String donacionCategoria;
        private Integer donacionCantidad;
        private LocalDateTime donacionFechaPublicacion;
        private LocalDate donacionFechaLimite;
        private String donacionEstado;
        private String donacionImagenBase64;
        private Double donacionLatitud;
        private Double donacionLongitud;
        private Boolean donacionEmpacado;
        private String donacionEstadoComida;

        // Datos del Donador de la Donacion anidada
        private DonadorDTO donador;

        // Datos de la Organizacion que recolectó
        private OrganizacionDTO organizacion;

        // Datos de la Evaluación
        private EvaluacionDetalleDTO evaluacionDetalle;

        // Constructor desde RecoleccionDetalleView (para listar recolecciones)
        public RecoleccionDTO(RecoleccionDetalleView view) {
            this.idRecoleccion = view.getIdRecoleccion();
            this.fechaAceptacion = view.getFechaAceptacion();
            this.estado = view.getRecoleccionEstado();
            this.firmaBase64 = view.getFirmaBase64();
            if (view.getComprobanteImagen() != null && view.getComprobanteImagen().length > 0) {
                this.comprobanteImagenBase64 = Base64.getEncoder().encodeToString(view.getComprobanteImagen());
            }

            // Datos de la Donacion
            this.idDonacion = view.getIdDonacion();
            this.donacionTitulo = view.getDonacionTitulo();
            this.donacionDescripcion = view.getDonacionDescripcion();
            this.donacionTipo = view.getDonacionTipo();
            this.donacionCategoria = view.getDonacionCategoria();
            this.donacionCantidad = view.getDonacionCantidad();
            this.donacionFechaPublicacion = view.getDonacionFechaPublicacion();
            this.donacionFechaLimite = view.getDonacionFechaLimite();
            this.donacionEstado = view.getDonacionEstado();
            if (view.getDonacionImagen() != null && view.getDonacionImagen().length > 0) {
                this.donacionImagenBase64 = Base64.getEncoder().encodeToString(view.getDonacionImagen());
            }
            this.donacionLatitud = view.getDonacionLatitud();
            this.donacionLongitud = view.getDonacionLongitud();
            this.donacionEmpacado = view.getDonacionEmpacado();
            this.donacionEstadoComida = view.getDonacionEstadoComida();

            // Mapeo del Donador (crear DTO anidado)
            this.donador = new DonadorDTO(
                    view.getIdDonador(),
                    view.getDonadorNombreEmpresa(),
                    view.getDonadorCorreo(),
                    view.getDonadorTelefono()
            );

            // Mapeo de la Organizacion (crear DTO anidado)
            this.organizacion = new OrganizacionDTO(
                    view.getIdOrganizacion(),
                    view.getOrganizacionNombreEmpresa(),
                    view.getOrganizacionCorreo(),
                    view.getOrganizacionTelefono()
            );

            // Mapeo de la Evaluación (crear DTO anidado si existe)
            if (view.getIdEvaluacion() != null) {
                this.evaluacionDetalle = new EvaluacionDetalleDTO(
                        view.getIdEvaluacion(),
                        view.getEvaluacionEstrellas(),
                        view.getEvaluacionComentario(),
                        view.getEvaluacionFecha()
                );
            }
        }


        // Getters y Setters
        public Integer getIdRecoleccion() { return idRecoleccion; }
        public void setIdRecoleccion(Integer idRecoleccion) { this.idRecoleccion = idRecoleccion; }
        public LocalDateTime getFechaAceptacion() { return fechaAceptacion; }
        public void setFechaAceptacion(LocalDateTime fechaAceptacion) { this.fechaAceptacion = fechaAceptacion; }
        public String getEstado() { return estado; } // Mapea a recoleccion_estado
        public void setEstado(String estado) { this.estado = estado; }
        public String getFirmaBase64() { return firmaBase64; }
        public void setFirmaBase64(String firmaBase64) { this.firmaBase64 = firmaBase64; }
        public String getComprobanteImagenBase64() { return comprobanteImagenBase64; }
        public void setComprobanteImagenBase64(String comprobanteImagenBase64) { this.comprobanteImagenBase64 = comprobanteImagenBase64; }

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
        public String getDonacionImagenBase64() { return donacionImagenBase64; }
        public void setDonacionImagenBase64(String donacionImagenBase64) { this.donacionImagenBase64 = donacionImagenBase64; }
        public Double getDonacionLatitud() { return donacionLatitud; }
        public void setDonacionLatitud(Double donacionLatitud) { this.donacionLatitud = donacionLatitud; }
        public Double getDonacionLongitud() { return donacionLongitud; }
        public void setDonacionLongitud(Double donacionLongitud) { this.donacionLongitud = donacionLongitud; }
        public Boolean getDonacionEmpacado() { return donacionEmpacado; }
        public void setDonacionEmpacado(Boolean donacionEmpacado) { this.donacionEmpacado = donacionEmpacado; }
        public String getDonacionEstadoComida() { return donacionEstadoComida; }
        public void setDonacionEstadoComida(String donacionEstadoComida) { this.donacionEstadoComida = donacionEstadoComida; }
        public DonadorDTO getDonador() { return donador; }
        public void setDonador(DonadorDTO donador) { this.donador = donador; }
        public OrganizacionDTO getOrganizacion() { return organizacion; }
        public void setOrganizacion(OrganizacionDTO organizacion) { this.organizacion = organizacion; }
        public EvaluacionDetalleDTO getEvaluacionDetalle() { return evaluacionDetalle; }
        public void setEvaluacionDetalle(EvaluacionDetalleDTO evaluacionDetalle) { this.evaluacionDetalle = evaluacionDetalle; }
    }

    // DTO anidado para Organizacion
    public static class OrganizacionDTO {
        private Integer idOrganizacion;
        private String nombreEmpresa;
        private String correo;
        private String telefono;

        public OrganizacionDTO(Organizacion organizacion) {
            this.idOrganizacion = organizacion.getIdOrganizacion();
            this.nombreEmpresa = organizacion.getNombreEmpresa();
            // Asume que el usuario relacionado con Organizacion está cargado
            if (organizacion.getUsuario() != null) {
                this.correo = organizacion.getUsuario().getCorreo();
                this.telefono = organizacion.getUsuario().getTelefono();
            }
        }
        // Nuevo constructor para usar con VISTAS, que no tienen objetos anidados sino campos planos
        public OrganizacionDTO(Integer idOrganizacion, String nombreEmpresa, String correo, String telefono) {
            this.idOrganizacion = idOrganizacion;
            this.nombreEmpresa = nombreEmpresa;
            this.correo = correo;
            this.telefono = telefono;
        }

        // Getters y Setters
        public Integer getIdOrganizacion() { return idOrganizacion; }
        public void setIdOrganizacion(Integer idOrganizacion) { this.idOrganizacion = idOrganizacion; }
        public String getNombreEmpresa() { return nombreEmpresa; }
        public void setNombreEmpresa(String nombreEmpresa) { this.nombreEmpresa = nombreEmpresa; }
        public String getCorreo() { return correo; }
        public void setCorreo(String correo) { this.correo = correo; }
        public String getTelefono() { return telefono; }
        public void setTelefono(String telefono) { this.telefono = telefono; }
    }

    // DTO anidado para Detalles de Evaluación
    public static class EvaluacionDetalleDTO {
        private Integer idEvaluacion;
        private Integer estrellas;
        private String comentario;
        private LocalDateTime fecha;

        public EvaluacionDetalleDTO(Integer idEvaluacion, Integer estrellas, String comentario, LocalDateTime fecha) {
            this.idEvaluacion = idEvaluacion;
            this.estrellas = estrellas;
            this.comentario = comentario;
            this.fecha = fecha;
        }
        // Getters y Setters
        public Integer getIdEvaluacion() { return idEvaluacion; }
        public void setIdEvaluacion(Integer idEvaluacion) { this.idEvaluacion = idEvaluacion; }
        public Integer getEstrellas() { return estrellas; }
        public void setEstrellas(Integer estrellas) { this.estrellas = estrellas; }
        public String getComentario() { return comentario; }
        public void setComentario(String comentario) { this.comentario = comentario; }
        public LocalDateTime getFecha() { return fecha; }
        public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
    }
}
