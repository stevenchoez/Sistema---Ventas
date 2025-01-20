package com.sistema.ventas.controller;

import com.sistema.ventas.dto.ApiResponse;
import com.sistema.ventas.dto.ProductoDTO;
import com.sistema.ventas.exception.NegocioException;
import com.sistema.ventas.model.Producto;
import com.sistema.ventas.model.Proveedor;
import com.sistema.ventas.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ProductoController {

    private final ProductoService productoService;

    private ProductoDTO convertToDTO(Producto producto) {
        Integer stockAsignado = productoService.obtenerStockAsignado(producto.getId());
        Integer stockDisponible = producto.getStock() - stockAsignado;
        
        return ProductoDTO.builder()
                .id(producto.getId())
                .nombre(producto.getNombre())
                .descripcion(producto.getDescripcion())
                .precio(producto.getPrecio())
                .codigo(producto.getCodigo())
                .marca(producto.getMarca())
                .categoria(producto.getCategoria())
                .stock(producto.getStock())
                .proveedorId(producto.getProveedor() != null ? producto.getProveedor().getId() : null)
                .stockAsignado(stockAsignado)
                .stockDisponible(stockDisponible)
                .build();
    }

    private Producto convertToEntity(ProductoDTO dto) {
        Producto producto = new Producto();
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setCodigo(dto.getCodigo());
        producto.setMarca(dto.getMarca());
        producto.setCategoria(dto.getCategoria());
        producto.setStock(dto.getStock());
        
        // Si hay un ID de proveedor, creamos una referencia al proveedor
        if (dto.getProveedorId() != null) {
            Proveedor proveedor = new Proveedor();
            proveedor.setId(dto.getProveedorId());
            producto.setProveedor(proveedor);
        }
        
        return producto;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductoDTO>> crearProducto(@Valid @RequestBody ProductoDTO productoDTO) {
        Producto producto = convertToEntity(productoDTO);
        Producto creado = productoService.crearProducto(producto);
        return ResponseEntity.ok(ApiResponse.success(convertToDTO(creado)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductoDTO>> actualizarProducto(
            @PathVariable Long id,
            @Valid @RequestBody ProductoDTO productoDTO) {
        Producto producto = convertToEntity(productoDTO);
        Producto actualizado = productoService.actualizarProducto(id, producto);
        return ResponseEntity.ok(ApiResponse.success(convertToDTO(actualizado)));
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<ApiResponse<ProductoDTO>> actualizarStock(
            @PathVariable Long id,
            @RequestBody ProductoDTO productoDTO) {
        if (productoDTO.getStock() == null) {
            throw new NegocioException("El stock es obligatorio");
        }
        Producto actualizado = productoService.actualizarStock(id, productoDTO.getStock());
        return ResponseEntity.ok(ApiResponse.success(convertToDTO(actualizado)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductoDTO>> obtenerProducto(@PathVariable Long id) {
        Producto producto = productoService.obtenerProducto(id);
        return ResponseEntity.ok(ApiResponse.success(convertToDTO(producto)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductoDTO>>> listarProductos() {
        List<ProductoDTO> productos = productoService.listarProductos()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(productos));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminarProducto(@PathVariable Long id) {
        productoService.eliminarProducto(id);
        return ResponseEntity.ok(ApiResponse.<Void>success(null, "Producto eliminado exitosamente"));
    }

    @GetMapping("/buscar")
    public ResponseEntity<ApiResponse<List<ProductoDTO>>> buscarProductos(@RequestParam String termino) {
        List<ProductoDTO> productos = productoService.buscarProductos(termino)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(productos));
    }

    @GetMapping("/bajo-stock")
    public ResponseEntity<ApiResponse<List<ProductoDTO>>> obtenerProductosBajoStock(
            @RequestParam(defaultValue = "10") int stockMinimo) {
        List<ProductoDTO> productos = productoService.obtenerProductosBajoStock(stockMinimo)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(productos));
    }

    @GetMapping("/tienda/{tiendaId}")
    public ResponseEntity<ApiResponse<List<ProductoDTO>>> obtenerProductosPorTienda(@PathVariable Long tiendaId) {
        List<Producto> productos = productoService.obtenerProductosPorTienda(tiendaId);
        List<ProductoDTO> productosDTO = productos.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(productosDTO));
    }
}
