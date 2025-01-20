package com.sistema.ventas.dto;

import java.math.BigDecimal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductoDTO {
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser mayor a 0")
    private BigDecimal precio;

    @NotBlank(message = "El código es obligatorio")
    private String codigo;

    private String descripcion;

    @NotNull(message = "El stock es obligatorio")
    private Integer stock;

    private String marca;
    
    private String categoria;
    
    private Long proveedorId;
    
    private Integer stockDisponible;
    
    private Integer stockAsignado;
}
