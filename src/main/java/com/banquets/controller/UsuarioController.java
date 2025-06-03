package com.banquets.controller;

import com.banquets.entity.Usuario;
import com.banquets.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // Obtener datos propios del usuario logueado
    @GetMapping("/me")
    public ResponseEntity<Usuario> obtenerDatosPropios(Principal principal) {
        return usuarioService.buscarPorCorreo(principal.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Actualizar datos propios
    @PutMapping("/me")
    public ResponseEntity<Usuario> actualizarDatos(Principal principal, @RequestBody Usuario datos) {
        return usuarioService.buscarPorCorreo(principal.getName())
                .map(usuario -> {
                    Usuario actualizado = usuarioService.actualizarDatos(usuario.getIdUsuario(), datos.getNombre(), datos.getTelefono());
                    return ResponseEntity.ok(actualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Cambiar contraseña
    @PutMapping("/me/password")
    public ResponseEntity<String> cambiarContrasena(Principal principal, @RequestBody String nuevaContrasena) {
        return usuarioService.buscarPorCorreo(principal.getName())
                .map(usuario -> {
                    usuarioService.actualizarContrasena(usuario.getIdUsuario(), nuevaContrasena);
                    return ResponseEntity.ok("Contraseña actualizada");
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Solo ADMIN puede listar todos usuarios
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> listarUsuarios() {
        // Implementa paginación si es necesario
        return ResponseEntity.ok(usuarioService.buscarTodos());
    }
}
