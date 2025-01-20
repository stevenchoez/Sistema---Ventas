package com.sistema.ventas.repository;

import com.sistema.ventas.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByIdentificacion(String identificacion);
    boolean existsByIdentificacion(String identificacion);
    boolean existsByEmail(String email);
    
    @Query("SELECT COUNT(c) > 0 FROM Cliente c WHERE c.identificacion = :identificacion AND c.id != :id")
    boolean existsByIdentificacionAndIdNot(@Param("identificacion") String identificacion, @Param("id") Long id);
    
    @Query("SELECT COUNT(c) > 0 FROM Cliente c WHERE c.email = :email AND c.id != :id")
    boolean existsByEmailAndIdNot(@Param("email") String email, @Param("id") Long id);
}
