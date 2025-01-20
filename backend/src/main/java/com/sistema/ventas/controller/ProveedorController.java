package com.sistema.ventas.controller;

import com.sistema.ventas.dto.ApiResponse;
import com.sistema.ventas.dto.ProveedorDTO;
import com.sistema.ventas.service.ProveedorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/proveedores")
@Tag(name = "Proveedores", description = "API para la gestión de proveedores")
@CrossOrigin(origins = "*")
public class ProveedorController {
    private final ProveedorService proveedorService;

    public ProveedorController(ProveedorService proveedorService) {
        this.proveedorService = proveedorService;
    }

    @GetMapping
    @Operation(summary = "Listar todos los proveedores")
    public ResponseEntity<ApiResponse<List<ProveedorDTO>>> listarProveedores() {
        List<ProveedorDTO> proveedores = proveedorService.listarProveedores();
        return ResponseEntity.ok(ApiResponse.success(proveedores));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un proveedor por su ID")
    public ResponseEntity<ApiResponse<ProveedorDTO>> obtenerProveedorPorId(@PathVariable Long id) {
        ProveedorDTO proveedor = proveedorService.obtenerProveedorPorId(id);
        return ResponseEntity.ok(ApiResponse.success(proveedor));
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo proveedor")
    public ResponseEntity<ApiResponse<ProveedorDTO>> crearProveedor(@Valid @RequestBody ProveedorDTO proveedorDTO) {
        ProveedorDTO nuevoProveedor = proveedorService.crearProveedor(proveedorDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(nuevoProveedor, "Proveedor creado exitosamente"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un proveedor existente")
    public ResponseEntity<ApiResponse<ProveedorDTO>> actualizarProveedor(
            @PathVariable Long id,
            @Valid @RequestBody ProveedorDTO proveedorDTO) {
        ProveedorDTO proveedorActualizado = proveedorService.actualizarProveedor(id, proveedorDTO);
        return ResponseEntity.ok(ApiResponse.success(proveedorActualizado, "Proveedor actualizado exitosamente"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un proveedor")
    public ResponseEntity<ApiResponse<Void>> eliminarProveedor(@PathVariable Long id) {
        proveedorService.eliminarProveedor(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .data(null)
                .message("Proveedor eliminado exitosamente")
                .success(true)
                .build());
    }
}
