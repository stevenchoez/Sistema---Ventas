package com.sistema.ventas.controller;

import com.sistema.ventas.dto.ApiResponse;
import com.sistema.ventas.dto.TiendaDTO;
import com.sistema.ventas.service.TiendaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping(value = "/api/tiendas", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TiendaController {

    private final TiendaService tiendaService;

    @PostMapping(consumes = "application/json;charset=UTF-8", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<?>> crearTienda(@Valid @RequestBody TiendaDTO tiendaDTO) {
        try {
            log.info("Creando tienda: {}", tiendaDTO);
            TiendaDTO nuevaTienda = tiendaService.crearTienda(tiendaDTO);
            return ResponseEntity.ok(ApiResponse.success(nuevaTienda));
        } catch (Exception e) {
            log.error("Error al crear tienda: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Error al crear tienda: " + e.getMessage()));
        }
    }

    @PutMapping(value = "/{id}", consumes = "application/json;charset=UTF-8", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<TiendaDTO>> actualizarTienda(
            @PathVariable Long id,
            @Valid @RequestBody TiendaDTO tiendaDTO) {
        return ResponseEntity.ok(ApiResponse.success(tiendaService.actualizarTienda(id, tiendaDTO)));
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<TiendaDTO>> obtenerTienda(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(tiendaService.obtenerTienda(id)));
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<List<TiendaDTO>>> listarTiendas() {
        return ResponseEntity.ok(ApiResponse.success(tiendaService.listarTiendas()));
    }

    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<Void>> eliminarTienda(@PathVariable Long id) {
        tiendaService.eliminarTienda(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Tienda eliminada exitosamente"));
    }
}
