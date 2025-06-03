package com.banquets.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final String secretKey = "banquets-jwt-secret-key-segura-de-al-menos-32-caracteres";
    private final long expiration = 86400000L; // 24 horas

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String generateToken(String correo, String tipoUsuario) {
        return Jwts.builder()
                .setSubject(correo)
                .claim("rol", tipoUsuario)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getCorreoFromToken(String token) {
        return getClaims(token).getSubject();
    }

    public String getRolFromToken(String token) {
        return getClaims(token).get("rol", String.class);
    }

    public boolean isTokenValid(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
