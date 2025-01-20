package com.sistema.ventas.dto;

import lombok.Data;
import lombok.Builder;

import java.math.BigDecimal;

@Data
@Builder
public class EstadisticaDTO {
    private BigDecimal ventasHoy;
    private BigDecimal ventasSemana;
    private Long totalClientes;
    private Long totalTiendas;
    private Integer productosStockBajo;
    private BigDecimal ventasTotales;
}
