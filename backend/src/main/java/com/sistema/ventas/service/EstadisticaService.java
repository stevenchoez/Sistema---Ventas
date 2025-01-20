package com.sistema.ventas.service;

import com.sistema.ventas.dto.EstadisticaDTO;
import com.sistema.ventas.repository.VentaRepository;
import com.sistema.ventas.repository.ClienteRepository;
import com.sistema.ventas.repository.TiendaRepository;
import com.sistema.ventas.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class EstadisticaService {

    private final VentaRepository ventaRepository;
    private final ClienteRepository clienteRepository;
    private final TiendaRepository tiendaRepository;
    private final ProductoRepository productoRepository;

    @Autowired
    public EstadisticaService(
            VentaRepository ventaRepository,
            ClienteRepository clienteRepository,
            TiendaRepository tiendaRepository,
            ProductoRepository productoRepository) {
        this.ventaRepository = ventaRepository;
        this.clienteRepository = clienteRepository;
        this.tiendaRepository = tiendaRepository;
        this.productoRepository = productoRepository;
    }

    public EstadisticaDTO obtenerResumenEstadisticas() {
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime inicioDia = ahora.toLocalDate().atStartOfDay();
        LocalDateTime inicioSemana = ahora.minusDays(7);

        return EstadisticaDTO.builder()
                .ventasHoy(ventaRepository.sumVentasByFechaBetween(inicioDia, ahora))
                .ventasSemana(ventaRepository.sumVentasByFechaBetween(inicioSemana, ahora))
                .totalClientes(clienteRepository.count())
                .totalTiendas(tiendaRepository.count())
                .productosStockBajo(obtenerCantidadProductosStockBajo())
                .ventasTotales(ventaRepository.sumTotalVentas())
                .build();
    }

    public List<Map<String, Object>> obtenerVentasPorCategoria() {
        return ventaRepository.findVentasPorCategoria();
    }

    public List<Map<String, Object>> obtenerVentasPorTienda() {
        return ventaRepository.findVentasPorTienda();
    }

    public List<Map<String, Object>> obtenerVentasMensuales() {
        return ventaRepository.findVentasMensuales();
    }

    public int obtenerCantidadProductosStockBajo() {
        return productoRepository.findProductosBajoStock(10).size(); // 10 como umbral de stock bajo
    }
}
