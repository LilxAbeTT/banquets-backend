package com.banquets.security;

import com.banquets.entity.Usuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UserDetailsImpl implements UserDetails {

    private static final Logger logger = LoggerFactory.getLogger(UserDetailsImpl.class);

    private final Usuario usuario;
    private final Integer id;
    private final String username;
    private final String password;
    private final boolean active; 

    public UserDetailsImpl(Usuario user) {
        this.usuario = user;
        this.id = user.getIdUsuario();
        this.username = user.getCorreo();
        this.password = user.getContrasena();
        this.active = user.getEstado() != null ? user.getEstado() : false;


        logger.info("UserDetailsImpl creado para usuario: {}, Tipo: {}, Activo: {}", user.getCorreo(), user.getTipoUsuario(), this.active);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String roleString = usuario.getTipoUsuario() != null ? "ROLE_" + usuario.getTipoUsuario().toUpperCase() : "ROLE_UNKNOWN";
        logger.info("Asignando autoridad: {}", roleString);
        return List.of(new SimpleGrantedAuthority(roleString));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return active;
    }

    @Override
    public boolean isAccountNonLocked() {
        return active;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return active;
    }

    @Override
    public boolean isEnabled() {
        return active; // Devolverá true si el estado es true (activo)
    }

    public Integer getId() {
        return id;
    }

    public String getRol() {
        return usuario.getTipoUsuario();
    }
}