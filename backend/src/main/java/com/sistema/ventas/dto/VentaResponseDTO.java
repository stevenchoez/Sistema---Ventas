package com.sistema.ventas.dto;

import com.sistema.ventas.model.Cliente;
import com.sistema.ventas.model.Tienda;
import com.sistema.ventas.model.Venta;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class VentaResponseDTO {
    private Long id;
    private LocalDateTime fechaVenta;
    private Double precioTotal;
    private String detallesJson;
    private ClienteDTO cliente;
    private TiendaDTO tienda;

    @Data
    public static class ClienteDTO {
        private Long id;
        private String nombre;
        private String identificacion;
    }

    @Data
    public static class TiendaDTO {
        private Long id;
        private String nombre;
        private String direccion;
    }

    public static VentaResponseDTO fromEntity(Venta venta) {
        VentaResponseDTO dto = new VentaResponseDTO();
        dto.setId(venta.getId());
        dto.setFechaVenta(venta.getFechaVenta());
        dto.setPrecioTotal(venta.getPrecioTotal().doubleValue());
        dto.setDetallesJson(venta.getDetallesJson());

        if (venta.getCliente() != null) {
            ClienteDTO clienteDTO = new ClienteDTO();
            clienteDTO.setId(venta.getCliente().getId());
            clienteDTO.setNombre(venta.getCliente().getNombre());
            clienteDTO.setIdentificacion(venta.getCliente().getIdentificacion());
            dto.setCliente(clienteDTO);
        }

        if (venta.getTienda() != null) {
            TiendaDTO tiendaDTO = new TiendaDTO();
            tiendaDTO.setId(venta.getTienda().getId());
            tiendaDTO.setNombre(venta.getTienda().getNombre());
            tiendaDTO.setDireccion(venta.getTienda().getDireccion());
            dto.setTienda(tiendaDTO);
        }

        return dto;
    }
}
