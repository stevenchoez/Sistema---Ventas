package com.sistema.ventas.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VentaDTO {
    private Long id;
    
    @NotNull(message = "El ID de la tienda es obligatorio")
    private Long tiendaId;
    
    @NotNull(message = "El ID del cliente es obligatorio")
    private Long clienteId;
    
    @NotEmpty(message = "Debe incluir al menos un detalle")
    @Valid
    private List<DetalleVentaDTO> detalles;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DetalleVentaDTO {
        @NotNull(message = "El ID del producto es obligatorio")
        private Long productoId;
        
        @NotNull(message = "La cantidad es obligatoria")
        @Positive(message = "La cantidad debe ser mayor a 0")
        private Integer cantidad;
        
        @NotNull(message = "El precio unitario es obligatorio")
        @Positive(message = "El precio unitario debe ser mayor a 0")
        private BigDecimal precioUnitario;
    }
}
