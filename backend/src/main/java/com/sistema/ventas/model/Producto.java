package com.sistema.ventas.model;

import com.sistema.ventas.model.common.EntidadBase;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "productos")
public class Producto extends EntidadBase {

    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser mayor a 0")
    @Column(nullable = false)
    private BigDecimal precio;

    @NotBlank(message = "El código es obligatorio")
    @Column(unique = true, nullable = false)
    private String codigo;

    private String marca;

    private String categoria;

    @NotNull(message = "El stock es obligatorio")
    @Column(nullable = false)
    private Integer stock;

    @Column(name = "stock_disponible")
    private Integer stockDisponible;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tienda_id", nullable = false)
    private Tienda tienda;

    @Column(nullable = false)
    private Boolean activo = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proveedor_id")
    private Proveedor proveedor;

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL)
    private List<ProductoTienda> productoTiendas = new ArrayList<>();

}
