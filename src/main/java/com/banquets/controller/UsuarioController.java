package com.banquets.controller;

import com.banquets.dto.CambiarContrasenaDTO;
import com.banquets.dto.EmailRequest;
import com.banquets.entity.Usuario;
import com.banquets.repository.UsuarioRepository;
import com.banquets.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioRepository usuarioRepository;


    @PostMapping("/recuperar-contrasena")
    public ResponseEntity<?> recuperarContrasena(@RequestBody EmailRequest emailRequest) {
        try {
            usuarioService.enviarTokenRecuperacion(emailRequest.getCorreo());
            return ResponseEntity.ok().body("{\"mensaje\": \"Correo enviado con instrucciones\"}");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Usuario> obtenerDatosPropios(Principal principal) {
        return usuarioService.buscarPorCorreo(principal.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Usuario> actualizarDatos(Principal principal, @RequestBody Usuario datos) {
        return usuarioService.buscarPorCorreo(principal.getName())
                .map(usuario -> {
                    Usuario actualizado = usuarioService.actualizarDatos(usuario.getIdUsuario(), datos.getNombre(), datos.getTelefono());
                    return ResponseEntity.ok(actualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me/password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> cambiarContrasena(Principal principal, @RequestBody String nuevaContrasena) {
        return usuarioService.buscarPorCorreo(principal.getName())
                .map(usuario -> {
                    usuarioService.actualizarContrasena(usuario.getIdUsuario(), nuevaContrasena);
                    return ResponseEntity.ok("Contraseña actualizada");
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> listarUsuarios() {
        return ResponseEntity.ok(usuarioService.buscarTodos());
    }

    @PutMapping("/cambiar-contrasena")
    public ResponseEntity<?> cambiarContrasena(@RequestBody CambiarContrasenaDTO dto) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(dto.getIdUsuario());
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado.");
        }

        String hashActual = usuarioOpt.get().getContrasena();
        boolean cambiada = usuarioService.cambiarContrasena(dto, hashActual);

        if (!cambiada) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La contraseña actual es incorrecta.");
        }

        return ResponseEntity.ok("Contraseña actualizada correctamente.");
    }
}
