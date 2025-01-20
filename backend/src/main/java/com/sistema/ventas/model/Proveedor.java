package com.sistema.ventas.model;

import jakarta.persistence.*;
import lombok.*;
import com.sistema.ventas.model.common.EntidadBase;

@Entity
@Table(name = "proveedores")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Proveedor extends EntidadBase {
    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, unique = true)
    private String ruc;

    @Column
    private String direccion;

    @Column
    private String telefono;

    @Column
    private String email;
}
