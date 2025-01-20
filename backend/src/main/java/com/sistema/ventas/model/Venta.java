package com.sistema.ventas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import com.sistema.ventas.model.common.EntidadBase;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "ventas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class Venta extends EntidadBase {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tienda_id", nullable = false)
    private Tienda tienda;

    @NotNull(message = "La fecha de venta es obligatoria")
    @Column(name = "fecha_venta", nullable = false)
    private LocalDateTime fechaVenta;

    @NotNull(message = "El precio total es obligatorio")
    @Column(name = "precio_total", nullable = false)
    private BigDecimal precioTotal;

    @Column(name = "detalles_json")
    @JdbcTypeCode(SqlTypes.JSON)
    private String detallesJson;

    public Long getClienteId() {
        return cliente != null ? cliente.getId() : null;
    }

    public Long getTiendaId() {
        return tienda != null ? tienda.getId() : null;
    }
}