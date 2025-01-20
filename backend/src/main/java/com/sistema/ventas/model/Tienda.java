package com.sistema.ventas.model;

import jakarta.persistence.*;
import lombok.*;
import com.sistema.ventas.model.common.EntidadBase;

@Entity
@Table(name = "tiendas")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Tienda extends EntidadBase {
    @Column(nullable = false)
    private String nombre;

    @Column
    private String direccion;

    @Column
    private String telefono;

    @Column
    private String email;

    @Column(name = "administrador")
    private String administrador;
}
