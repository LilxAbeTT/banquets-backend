package com.banquets.controller;

import com.banquets.service.HistorialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/historial")
public class HistorialController {

    @Autowired
    private HistorialService historialService;

    @GetMapping("/donador/{id}")
    public List<Map<String, Object>> historialDonador(@PathVariable("id") Integer id) {
        return historialService.obtenerHistorialDonador(id);
    }

    @GetMapping("/organizacion/{id}")
    public List<Map<String, Object>> historialOrganizacion(@PathVariable("id") Integer id) {
        return historialService.obtenerHistorialOrganizacion(id);
    }
}
