package com.banquets.config;

import com.banquets.service.*;
import com.banquets.service.impl.SolicitudIngresoServiceImpl;
import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

@TestConfiguration
public class TestServiceConfig {

    @Bean
    public UsuarioService usuarioService() {
        return Mockito.mock(UsuarioService.class);
    }

    @Bean
    public DonacionService donacionService() {
        return Mockito.mock(DonacionService.class);
    }

    @Bean
    public RecoleccionService recoleccionService() {
        return Mockito.mock(RecoleccionService.class);
    }

    @Bean
    public EvaluacionService evaluacionService() {
        return Mockito.mock(EvaluacionService.class);
    }

    @Bean
    public SolicitudIngresoServiceImpl solicitudIngresoService() {
        return Mockito.mock(SolicitudIngresoServiceImpl.class);
    }

    @Bean
    public MensajeSoporteService mensajeSoporteService() {
        return Mockito.mock(MensajeSoporteService.class);
    }

    @Bean
    public MensajeChatService mensajeChatService() {
        return Mockito.mock(MensajeChatService.class);
    }

    @Bean
    public NotificacionService notificacionService() {
        return Mockito.mock(NotificacionService.class);
    }
}
