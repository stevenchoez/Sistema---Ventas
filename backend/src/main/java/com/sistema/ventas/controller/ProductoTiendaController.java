package com.sistema.ventas.controller;

import com.sistema.ventas.dto.ApiResponse;
import com.sistema.ventas.dto.ProductoTiendaDTO;
import com.sistema.ventas.model.Producto;
import com.sistema.ventas.model.ProductoTienda;
import com.sistema.ventas.model.Tienda;
import com.sistema.ventas.service.ProductoService;
import com.sistema.ventas.service.ProductoTiendaService;
import com.sistema.ventas.service.TiendaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/productos-tienda")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ProductoTiendaController {

    private final ProductoTiendaService productoTiendaService;
    private final ProductoService productoService;
    private final TiendaService tiendaService;

    private ProductoTiendaDTO convertToDTO(ProductoTienda productoTienda) {
        return ProductoTiendaDTO.builder()
                .id(productoTienda.getId())
                .tiendaId(productoTienda.getTienda().getId())
                .productoId(productoTienda.getProducto().getId())
                .stock(productoTienda.getStockLocal())
                .nombreProducto(productoTienda.getProducto().getNombre())
                .codigoProducto(productoTienda.getProducto().getCodigo())
                .nombreTienda(productoTienda.getTienda().getNombre())
                .build();
    }

    private ProductoTienda convertToEntity(ProductoTiendaDTO dto) {
        Producto producto = productoService.obtenerProducto(dto.getProductoId());
        Tienda tienda = tiendaService.obtenerTiendaEntity(dto.getTiendaId());
        
        return ProductoTienda.builder()
                .tienda(tienda)
                .producto(producto)
                .stockLocal(dto.getStock())
                .build();
    }

    @GetMapping("/tienda/{tiendaId}")
    public ResponseEntity<ApiResponse<List<ProductoTiendaDTO>>> listarProductosPorTienda(@PathVariable Long tiendaId) {
        List<ProductoTiendaDTO> productos = productoTiendaService.listarProductosPorTienda(tiendaId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(productos));
    }

    @GetMapping("/{tiendaId}")
    public ResponseEntity<ApiResponse<List<ProductoTiendaDTO>>> obtenerProductosPorTienda(@PathVariable Long tiendaId) {
        List<ProductoTiendaDTO> productos = productoTiendaService.listarProductosPorTienda(tiendaId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(productos));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductoTiendaDTO>> asignarProducto(@Valid @RequestBody ProductoTiendaDTO dto) {
        ProductoTienda productoTienda = productoTiendaService.asignarProductoATienda(
            dto.getTiendaId(),
            dto.getProductoId(),
            dto.getStock()
        );
        return ResponseEntity.ok(ApiResponse.success(convertToDTO(productoTienda)));
    }

    @PutMapping("/{tiendaId}/{productoId}")
    public ResponseEntity<ApiResponse<ProductoTiendaDTO>> actualizarStock(
            @PathVariable Long tiendaId,
            @PathVariable Long productoId,
            @RequestParam Integer cantidad) {
        ProductoTienda actualizado = productoTiendaService.actualizarStock(tiendaId, productoId, cantidad);
        return ResponseEntity.ok(ApiResponse.success(convertToDTO(actualizado)));
    }

    @DeleteMapping("/{tiendaId}/{productoId}")
    public ResponseEntity<ApiResponse<Void>> eliminarProducto(
            @PathVariable Long tiendaId,
            @PathVariable Long productoId) {
        productoTiendaService.eliminarProductoDeTienda(tiendaId, productoId);
        return ResponseEntity.ok(ApiResponse.<Void>success(null, "Producto eliminado de la tienda exitosamente"));
    }

    @GetMapping("/{tiendaId}/bajo-stock")
    public ResponseEntity<ApiResponse<List<ProductoTiendaDTO>>> obtenerProductosBajoStock(
            @PathVariable Long tiendaId,
            @RequestParam(defaultValue = "10") Integer stockMinimo) {
        List<ProductoTiendaDTO> productos = productoTiendaService.obtenerProductosBajoStockEnTienda(tiendaId, stockMinimo)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(productos));
    }
}
