package com.sistema.ventas.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductoTiendaDTO {
    private Long id;

    @NotNull(message = "La tienda es obligatoria")
    private Long tiendaId;

    @NotNull(message = "El producto es obligatorio")
    private Long productoId;

    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;

    // Campos adicionales para mostrar información relacionada
    private String nombreProducto;
    private String codigoProducto;
    private String nombreTienda;
    private BigDecimal precioProducto;
}
