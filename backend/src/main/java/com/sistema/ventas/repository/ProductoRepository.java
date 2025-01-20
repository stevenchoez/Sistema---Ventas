package com.sistema.ventas.repository;

import com.sistema.ventas.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    Optional<Producto> findByCodigo(String codigo);
    boolean existsByCodigo(String codigo);
    List<Producto> findByCategoria(String categoria);
    
    @Query("SELECT p FROM Producto p WHERE p.stock < :stockMinimo")
    List<Producto> findProductosBajoStock(int stockMinimo);
    
    @Query("SELECT p FROM Producto p WHERE LOWER(p.nombre) LIKE LOWER(CONCAT('%', :termino, '%')) " +
           "OR LOWER(p.codigo) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<Producto> buscarProductos(String termino);
    
    List<Producto> findByTienda_IdAndActivoTrue(Long tiendaId);
}
