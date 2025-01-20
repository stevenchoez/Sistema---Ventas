package com.sistema.ventas.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sistema.ventas.dto.VentaDTO;
import com.sistema.ventas.exception.NegocioException;
import com.sistema.ventas.model.Cliente;
import com.sistema.ventas.model.Tienda;
import com.sistema.ventas.model.Venta;
import com.sistema.ventas.repository.ClienteRepository;
import com.sistema.ventas.repository.TiendaRepository;
import com.sistema.ventas.repository.VentaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class VentaService {
    
    private final VentaRepository ventaRepository;
    private final ClienteRepository clienteRepository;
    private final TiendaRepository tiendaRepository;
    private final ProductoTiendaService productoTiendaService;
    private final ObjectMapper objectMapper;
    
    public Venta registrarVenta(VentaDTO ventaDTO) {
        Cliente cliente = clienteRepository.findById(ventaDTO.getClienteId())
            .orElseThrow(() -> new NegocioException("Cliente no encontrado"));
            
        Tienda tienda = tiendaRepository.findById(ventaDTO.getTiendaId())
            .orElseThrow(() -> new NegocioException("Tienda no encontrada"));
            
        // Calcular precio total
        BigDecimal precioTotal = ventaDTO.getDetalles().stream()
            .map(detalle -> detalle.getPrecioUnitario().multiply(BigDecimal.valueOf(detalle.getCantidad())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
            
        // Convertir detalles a JSON
        String detallesJson;
        try {
            detallesJson = objectMapper.writeValueAsString(ventaDTO.getDetalles());
        } catch (JsonProcessingException e) {
            throw new NegocioException("Error al procesar los detalles de la venta");
        }
        
        Venta venta = Venta.builder()
            .cliente(cliente)
            .tienda(tienda)
            .fechaVenta(LocalDateTime.now())
            .precioTotal(precioTotal)
            .detallesJson(detallesJson)
            .build();
            
        // Actualizar stock
        ventaDTO.getDetalles().forEach(detalle -> {
            productoTiendaService.actualizarStock(
                ventaDTO.getTiendaId(), 
                detalle.getProductoId(), 
                -detalle.getCantidad()
            );
        });
            
        return ventaRepository.save(venta);
    }
    
    @Transactional(readOnly = true)
    public List<Venta> listarVentas() {
        return ventaRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public List<Venta> obtenerVentasPorTienda(Long tiendaId, LocalDateTime inicio, LocalDateTime fin) {
        return ventaRepository.findByTienda_IdAndFechaVentaBetween(tiendaId, inicio, fin);
    }
    
    @Transactional(readOnly = true)
    public BigDecimal calcularTotalVentas(Long tiendaId, LocalDateTime inicio, LocalDateTime fin) {
        return ventaRepository.calcularTotalVentasPorTiendaYFecha(tiendaId, inicio, fin);
    }
    
    @Transactional(readOnly = true)
    public List<Venta> obtenerVentasPorCliente(Long clienteId) {
        return ventaRepository.findByCliente_Id(clienteId);
    }
}