package com.sistema.ventas.controller;

import com.sistema.ventas.dto.VentaDTO;
import com.sistema.ventas.dto.VentaResponseDTO;
import com.sistema.ventas.model.Venta;
import com.sistema.ventas.service.VentaService;
import com.sistema.ventas.dto.ResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ventas")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:8080")
public class VentaController {

    private final VentaService ventaService;

    @PostMapping
    public ResponseEntity<ResponseDTO<VentaResponseDTO>> registrarVenta(@Valid @RequestBody VentaDTO ventaDTO) {
        try {
            Venta venta = ventaService.registrarVenta(ventaDTO);
            return ResponseEntity.ok(new ResponseDTO<>(
                VentaResponseDTO.fromEntity(venta),
                "Venta registrada exitosamente",
                true
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(new ResponseDTO<>(
                null,
                "Error al registrar la venta: " + e.getMessage(),
                false
            ));
        }
    }

    @GetMapping
    public ResponseEntity<ResponseDTO<List<VentaResponseDTO>>> listarVentas() {
        try {
            List<VentaResponseDTO> ventas = ventaService.listarVentas().stream()
                .map(VentaResponseDTO::fromEntity)
                .collect(Collectors.toList());
            return ResponseEntity.ok(new ResponseDTO<>(
                ventas,
                "Ventas obtenidas exitosamente",
                true
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(new ResponseDTO<>(
                null,
                "Error al obtener las ventas: " + e.getMessage(),
                false
            ));
        }
    }

    @GetMapping("/tienda/{tiendaId}")
    public ResponseEntity<ResponseDTO<List<VentaResponseDTO>>> obtenerVentasPorTienda(
            @PathVariable Long tiendaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        try {
            List<VentaResponseDTO> ventas = ventaService.obtenerVentasPorTienda(tiendaId, inicio, fin)
                .stream()
                .map(VentaResponseDTO::fromEntity)
                .collect(Collectors.toList());
            return ResponseEntity.ok(new ResponseDTO<>(
                ventas,
                "Ventas obtenidas exitosamente",
                true
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(new ResponseDTO<>(
                null,
                "Error al obtener las ventas: " + e.getMessage(),
                false
            ));
        }
    }

    @GetMapping("/tienda/{tiendaId}/total")
    public ResponseEntity<ResponseDTO<Double>> calcularTotalVentas(
            @PathVariable Long tiendaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        try {
            Double total = ventaService.calcularTotalVentas(tiendaId, inicio, fin).doubleValue();
            return ResponseEntity.ok(new ResponseDTO<>(
                total,
                "Total calculado exitosamente",
                true
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(new ResponseDTO<>(
                null,
                "Error al calcular el total: " + e.getMessage(),
                false
            ));
        }
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<ResponseDTO<List<VentaResponseDTO>>> obtenerVentasPorCliente(@PathVariable Long clienteId) {
        try {
            List<VentaResponseDTO> ventas = ventaService.obtenerVentasPorCliente(clienteId)
                .stream()
                .map(VentaResponseDTO::fromEntity)
                .collect(Collectors.toList());
            return ResponseEntity.ok(new ResponseDTO<>(
                ventas,
                "Ventas obtenidas exitosamente",
                true
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(new ResponseDTO<>(
                null,
                "Error al obtener las ventas: " + e.getMessage(),
                false
            ));
        }
    }
}