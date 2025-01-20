package com.sistema.ventas.service;

import com.sistema.ventas.exception.NegocioException;
import com.sistema.ventas.model.Producto;
import com.sistema.ventas.model.ProductoTienda;
import com.sistema.ventas.model.Proveedor;
import com.sistema.ventas.dto.ProveedorDTO;
import com.sistema.ventas.repository.ProductoRepository;
import com.sistema.ventas.repository.ProductoTiendaRepository;
import com.sistema.ventas.service.ProveedorService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductoService {
    
    private final ProductoRepository productoRepository;
    private final ProductoTiendaRepository productoTiendaRepository;
    private final ProveedorService proveedorService;
    
    public Producto crearProducto(Producto producto) {
        if (productoRepository.existsByCodigo(producto.getCodigo())) {
            throw new NegocioException("Ya existe un producto con el código: " + producto.getCodigo());
        }
        
        // Validar que el proveedor exista si se proporciona
        if (producto.getProveedor() != null && producto.getProveedor().getId() != null) {
            ProveedorDTO proveedorDTO = proveedorService.obtenerProveedorPorId(producto.getProveedor().getId());
            Proveedor proveedor = new Proveedor();
            BeanUtils.copyProperties(proveedorDTO, proveedor);
            producto.setProveedor(proveedor);
        }
        
        return productoRepository.save(producto);
    }
    
    public Producto actualizarProducto(Long id, Producto producto) {
        Producto productoExistente = productoRepository.findById(id)
            .orElseThrow(() -> new NegocioException("No se encontró el producto con ID: " + id));
            
        if (!productoExistente.getCodigo().equals(producto.getCodigo()) &&
            productoRepository.existsByCodigo(producto.getCodigo())) {
            throw new NegocioException("Ya existe un producto con el código: " + producto.getCodigo());
        }
        
        // Si estamos actualizando solo el stock
        if (producto.getStock() != null && producto.getNombre() == null) {
            productoExistente.setStock(productoExistente.getStock() + producto.getStock());
        } else {
            // Actualizamos los demás campos solo si no son nulos
            if (producto.getNombre() != null) productoExistente.setNombre(producto.getNombre());
            if (producto.getDescripcion() != null) productoExistente.setDescripcion(producto.getDescripcion());
            if (producto.getPrecio() != null) productoExistente.setPrecio(producto.getPrecio());
            if (producto.getCodigo() != null) productoExistente.setCodigo(producto.getCodigo());
            if (producto.getCategoria() != null) productoExistente.setCategoria(producto.getCategoria());
            if (producto.getStock() != null) productoExistente.setStock(producto.getStock());
            
            // Validar y actualizar el proveedor si se proporciona
            if (producto.getProveedor() != null && producto.getProveedor().getId() != null) {
                ProveedorDTO proveedorDTO = proveedorService.obtenerProveedorPorId(producto.getProveedor().getId());
                Proveedor proveedor = new Proveedor();
                BeanUtils.copyProperties(proveedorDTO, proveedor);
                productoExistente.setProveedor(proveedor);
            }
        }
        
        return productoRepository.save(productoExistente);
    }
    
    @Transactional(readOnly = true)
    public Producto obtenerProducto(Long id) {
        return productoRepository.findById(id)
            .orElseThrow(() -> new NegocioException("No se encontró el producto con ID: " + id));
    }
    
    @Transactional(readOnly = true)
    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }
    
    public void eliminarProducto(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new NegocioException("No se encontró el producto con ID: " + id);
        }
        productoRepository.deleteById(id);
    }
    
    @Transactional(readOnly = true)
    public List<Producto> buscarProductos(String termino) {
        return productoRepository.buscarProductos(termino);
    }
    
    @Transactional(readOnly = true)
    public List<Producto> obtenerProductosBajoStock(int stockMinimo) {
        return productoRepository.findProductosBajoStock(stockMinimo);
    }
    
    @Transactional
    public Producto actualizarStock(Long id, Integer cantidad) {
        Producto producto = obtenerProducto(id);
        Integer stockAnterior = producto.getStock();
        Integer nuevoStock = stockAnterior + cantidad;
        
        if (nuevoStock < 0) {
            throw new NegocioException("El stock no puede ser negativo");
        }
        
        producto.setStock(nuevoStock);
        producto.setStockDisponible(nuevoStock); // El stock disponible es igual al stock actual
        
        return productoRepository.save(producto);
    }
    
    @Transactional(readOnly = true)
    public Integer obtenerStockAsignado(Long productoId) {
        return productoTiendaRepository.obtenerStockTotalEnTiendas(productoId);
    }

    @Transactional
    public void actualizarStockDisponible(Producto producto) {
        Integer stockAsignado = obtenerStockAsignado(producto.getId());
        producto.setStockDisponible(producto.getStock() - stockAsignado);
        productoRepository.save(producto);
    }

    @Transactional(readOnly = true)
    public List<Producto> obtenerProductosPorTienda(Long tiendaId) {
        return productoTiendaRepository.findByTiendaId(tiendaId)
            .stream()
            .map(ProductoTienda::getProducto)
            .filter(producto -> producto.getStock() > 0)
            .collect(Collectors.toList());
    }
}
