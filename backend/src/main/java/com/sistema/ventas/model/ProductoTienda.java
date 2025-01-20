package com.sistema.ventas.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.sistema.ventas.model.common.EntidadBase;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "productos_tienda")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ProductoTienda extends EntidadBase {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tienda_id", nullable = false)
    @JsonIgnoreProperties({"productoTiendas", "ventas", "hibernateLazyInitializer", "handler"})
    private Tienda tienda;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    @JsonIgnoreProperties({"productoTiendas", "detallesVenta", "hibernateLazyInitializer", "handler"})
    private Producto producto;

    @NotNull(message = "El stock local es obligatorio")
    @Min(value = 0, message = "El stock local no puede ser negativo")
    @Column(name = "stock_local", nullable = false)
    private Integer stockLocal;
}
