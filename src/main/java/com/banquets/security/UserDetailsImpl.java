package com.banquets.security;

import com.banquets.entity.Usuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class UserDetailsImpl implements UserDetails {

    private final Usuario usuario; // 🔧 Aquí se guarda el usuario
    private final Integer id;
    private final String username;
    private final String password;
    private final boolean active;

    public UserDetailsImpl(Usuario user) {
        this.usuario = user; // 🔧 Asignar usuario al atributo
        this.id = user.getIdUsuario();
        this.username = user.getCorreo();
        this.password = user.getContrasena();
        this.active = user.getEstado().equalsIgnoreCase("activo");
    }

    // En UserDetailsImpl.java
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getTipoUsuario().toUpperCase()));
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
        return active;
    }

    public Integer getId() {
        return id;
    }

    public String getRol() {
        return usuario.getTipoUsuario();
    }
}
