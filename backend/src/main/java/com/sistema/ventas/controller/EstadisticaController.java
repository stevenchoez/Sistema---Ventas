package com.sistema.ventas.controller;

import com.sistema.ventas.dto.ApiResponse;
import com.sistema.ventas.dto.EstadisticaDTO;
import com.sistema.ventas.service.EstadisticaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/estadisticas")
@CrossOrigin(origins = "*")
public class EstadisticaController {

    private final EstadisticaService estadisticaService;

    @Autowired
    public EstadisticaController(EstadisticaService estadisticaService) {
        this.estadisticaService = estadisticaService;
    }

    @GetMapping("/resumen")
    public ResponseEntity<ApiResponse<EstadisticaDTO>> obtenerResumen() {
        EstadisticaDTO resumen = estadisticaService.obtenerResumenEstadisticas();
        return ResponseEntity.ok(ApiResponse.success(resumen));
    }

    @GetMapping("/ventas/categoria")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> obtenerVentasPorCategoria() {
        List<Map<String, Object>> ventasPorCategoria = estadisticaService.obtenerVentasPorCategoria();
        return ResponseEntity.ok(ApiResponse.success(ventasPorCategoria));
    }

    @GetMapping("/ventas/tienda")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> obtenerVentasPorTienda() {
        List<Map<String, Object>> ventasPorTienda = estadisticaService.obtenerVentasPorTienda();
        return ResponseEntity.ok(ApiResponse.success(ventasPorTienda));
    }

    @GetMapping("/ventas/mensual")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> obtenerVentasMensuales() {
        List<Map<String, Object>> ventasMensuales = estadisticaService.obtenerVentasMensuales();
        return ResponseEntity.ok(ApiResponse.success(ventasMensuales));
    }

    @GetMapping("/productos/stock-bajo")
    public ResponseEntity<ApiResponse<Integer>> obtenerProductosStockBajo() {
        int cantidad = estadisticaService.obtenerCantidadProductosStockBajo();
        return ResponseEntity.ok(ApiResponse.success(cantidad));
    }
}
