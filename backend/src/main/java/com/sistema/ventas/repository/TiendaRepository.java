package com.sistema.ventas.repository;

import com.sistema.ventas.model.Tienda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TiendaRepository extends JpaRepository<Tienda, Long> {
    Optional<Tienda> findByNombre(String nombre);
    boolean existsByNombre(String nombre);
}
