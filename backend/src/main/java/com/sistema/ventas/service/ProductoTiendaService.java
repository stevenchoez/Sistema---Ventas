package com.sistema.ventas.service;

import com.sistema.ventas.exception.NegocioException;
import com.sistema.ventas.mapper.TiendaMapper;
import com.sistema.ventas.model.Producto;
import com.sistema.ventas.model.ProductoTienda;
import com.sistema.ventas.model.Tienda;
import com.sistema.ventas.repository.ProductoTiendaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductoTiendaService {
    
    private final ProductoTiendaRepository productoTiendaRepository;
    private final ProductoService productoService;
    private final TiendaService tiendaService;
    private final TiendaMapper tiendaMapper;
    
    public ProductoTienda asignarProductoATienda(Long tiendaId, Long productoId, Integer stockInicial) {
        System.out.println("Iniciando asignación de producto " + productoId + " a tienda " + tiendaId);
        
        // Obtener la entidad Tienda directamente
        Tienda tienda = tiendaService.obtenerTiendaEntity(tiendaId);
        Producto producto = productoService.obtenerProducto(productoId);
        
        System.out.println("Stock actual del producto: " + producto.getStock());
        
        // Verificar si el producto ya está asignado a la tienda
        productoTiendaRepository.findByTiendaIdAndProductoId(tiendaId, productoId)
            .ifPresent(pt -> {
                throw new NegocioException("El producto ya está asignado a esta tienda");
            });
            
        // Verificar si hay suficiente stock disponible
        if (producto.getStock() < stockInicial) {
            throw new NegocioException("No hay suficiente stock disponible. Stock disponible: " + producto.getStock());
        }
            
        ProductoTienda productoTienda = ProductoTienda.builder()
            .tienda(tienda)
            .producto(producto)
            .stockLocal(stockInicial)
            .build();
            
        // Guardar la asignación
        ProductoTienda saved = productoTiendaRepository.save(productoTienda);
        
        // Actualizar el stock total del producto
        productoService.actualizarStock(productoId, -stockInicial);
        
        return saved;
    }
    
    public ProductoTienda actualizarStock(Long tiendaId, Long productoId, Integer cantidad) {
        System.out.println("Iniciando actualización de stock para producto " + productoId + " en tienda " + tiendaId);
        System.out.println("Cantidad a modificar: " + cantidad);
        
        ProductoTienda productoTienda = productoTiendaRepository
            .findByTiendaIdAndProductoId(tiendaId, productoId)
            .orElseThrow(() -> new NegocioException("El producto no está asignado a esta tienda"));
            
        System.out.println("Stock actual en tienda: " + productoTienda.getStockLocal());
            
        // Si es una reducción de stock, verificar que haya suficiente en la tienda
        if (cantidad < 0 && productoTienda.getStockLocal() + cantidad < 0) {
            throw new NegocioException("No hay suficiente stock en la tienda");
        }
        
        // Si es un aumento de stock, verificar que haya suficiente en el producto
        Producto producto = productoService.obtenerProducto(productoId);
        
        if (cantidad > 0 && producto.getStock() < cantidad) {
            throw new NegocioException("No hay suficiente stock disponible en el inventario general. Stock disponible: " + producto.getStock());
        }
        
        // Actualizar el stock local
        productoTienda.setStockLocal(productoTienda.getStockLocal() + cantidad);
        System.out.println("Nuevo stock en tienda: " + productoTienda.getStockLocal());
        
        // Actualizar el stock total del producto
        productoService.actualizarStock(productoId, -cantidad);
        
        return productoTiendaRepository.save(productoTienda);
    }
    
    @Transactional(readOnly = true)
    public List<ProductoTienda> listarProductosPorTienda(Long tiendaId) {
        return productoTiendaRepository.findByTiendaId(tiendaId);
    }
    
    @Transactional(readOnly = true)
    public List<ProductoTienda> obtenerProductosBajoStockEnTienda(Long tiendaId, int stockMinimo) {
        return productoTiendaRepository.findProductosBajoStockEnTienda(tiendaId, stockMinimo);
    }
    
    public void eliminarProductoDeTienda(Long tiendaId, Long productoId) {
        System.out.println("Iniciando eliminación de producto " + productoId + " de tienda " + tiendaId);
        
        ProductoTienda productoTienda = productoTiendaRepository
            .findByTiendaIdAndProductoId(tiendaId, productoId)
            .orElseThrow(() -> new NegocioException("El producto no está asignado a esta tienda"));
            
        // Devolver el stock al inventario general
        Integer stockADevolver = productoTienda.getStockLocal();
        System.out.println("Devolviendo " + stockADevolver + " unidades al stock global");
        
        Producto productoActualizado = productoService.actualizarStock(productoId, stockADevolver);
        System.out.println("Nuevo stock global: " + productoActualizado.getStock());
            
        productoTiendaRepository.delete(productoTienda);
        System.out.println("Producto eliminado de la tienda");
    }
}
