package com.sistema.ventas.repository;

import com.sistema.ventas.model.ProductoTienda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoTiendaRepository extends JpaRepository<ProductoTienda, Long> {
    List<ProductoTienda> findByTiendaId(Long tiendaId);
    List<ProductoTienda> findByProductoId(Long productoId);
    Optional<ProductoTienda> findByTiendaIdAndProductoId(Long tiendaId, Long productoId);
    
    @Query("SELECT COALESCE(SUM(pt.stockLocal), 0) FROM ProductoTienda pt WHERE pt.producto.id = :productoId")
    Integer obtenerStockTotalEnTiendas(@Param("productoId") Long productoId);
    
    @Query("SELECT pt FROM ProductoTienda pt WHERE pt.tienda.id = :tiendaId AND pt.stockLocal <= :stockMinimo")
    List<ProductoTienda> findProductosBajoStockEnTienda(@Param("tiendaId") Long tiendaId, @Param("stockMinimo") int stockMinimo);
}
