// MensajeChatRepository.java
package com.banquets.repository;

import com.banquets.entity.MensajeChat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MensajeChatRepository extends JpaRepository<MensajeChat, Integer> {
    List<MensajeChat> findByRecoleccionIdRecoleccionOrderByFechaAsc(Integer idRecoleccion);
}
