package com.sistema.ventas.repository;

import com.sistema.ventas.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {
    
    List<Venta> findByCliente_Id(Long clienteId);
    
    List<Venta> findByTienda_IdAndFechaVentaBetween(Long tiendaId, LocalDateTime inicio, LocalDateTime fin);
    
    @Query("SELECT SUM(v.precioTotal) FROM Venta v WHERE v.tienda.id = :tiendaId AND v.fechaVenta BETWEEN :inicio AND :fin")
    BigDecimal calcularTotalVentasPorTiendaYFecha(Long tiendaId, LocalDateTime inicio, LocalDateTime fin);
    
    @Query("SELECT COALESCE(SUM(v.precioTotal), 0) FROM Venta v WHERE v.fechaVenta BETWEEN :fechaInicio AND :fechaFin")
    BigDecimal sumVentasByFechaBetween(LocalDateTime fechaInicio, LocalDateTime fechaFin);

    @Query("SELECT COALESCE(SUM(v.precioTotal), 0) FROM Venta v")
    BigDecimal sumTotalVentas();

    @Query(value = "SELECT p.categoria as categoria, COUNT(DISTINCT v.id) as cantidad, COALESCE(SUM(v.precio_total), 0) as total " +
           "FROM ventas v " +
           "CROSS JOIN LATERAL json_array_elements(CAST(v.detalles_json AS json)) as detalles " +
           "JOIN productos p ON CAST(detalles->>'productoId' AS BIGINT) = p.id " +
           "GROUP BY p.categoria " +
           "ORDER BY total DESC", nativeQuery = true)
    List<Map<String, Object>> findVentasPorCategoria();

    @Query(value = "SELECT t.nombre as tienda, COUNT(v.id) as cantidad, COALESCE(SUM(v.precio_total), 0) as total " +
           "FROM ventas v " +
           "JOIN tiendas t ON v.tienda_id = t.id " +
           "GROUP BY t.nombre " +
           "ORDER BY total DESC", nativeQuery = true)
    List<Map<String, Object>> findVentasPorTienda();

    @Query(value = "SELECT EXTRACT(YEAR FROM v.fecha_venta) as year, " +
           "EXTRACT(MONTH FROM v.fecha_venta) as month, " +
           "COUNT(v.id) as cantidad, " +
           "COALESCE(SUM(v.precio_total), 0) as total " +
           "FROM ventas v " +
           "GROUP BY EXTRACT(YEAR FROM v.fecha_venta), EXTRACT(MONTH FROM v.fecha_venta) " +
           "ORDER BY year DESC, month DESC", nativeQuery = true)
    List<Map<String, Object>> findVentasMensuales();
}