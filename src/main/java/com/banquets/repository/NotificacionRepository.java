// NotificacionRepository.java
package com.banquets.repository;

import com.banquets.entity.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificacionRepository extends JpaRepository<Notificacion, Integer> {
    List<Notificacion> findByUsuarioIdUsuarioOrderByFechaDesc(Integer idUsuario);
}
