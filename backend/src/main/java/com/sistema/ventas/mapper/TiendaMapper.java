package com.sistema.ventas.mapper;

import com.sistema.ventas.dto.TiendaDTO;
import com.sistema.ventas.model.Tienda;
import org.springframework.stereotype.Component;

@Component
public class TiendaMapper {

    public TiendaDTO toDTO(Tienda tienda) {
        if (tienda == null) {
            return null;
        }

        return TiendaDTO.builder()
                .id(tienda.getId())
                .nombre(tienda.getNombre())
                .direccion(tienda.getDireccion())
                .telefono(tienda.getTelefono())
                .email(tienda.getEmail())
                .administrador(tienda.getAdministrador())
                .build();
    }

    public Tienda toEntity(TiendaDTO dto) {
        if (dto == null) {
            return null;
        }

        return Tienda.builder()
                .nombre(dto.getNombre())
                .direccion(dto.getDireccion())
                .telefono(dto.getTelefono())
                .email(dto.getEmail())
                .administrador(dto.getAdministrador())
                .build();
    }

    public void updateTiendaFromDTO(TiendaDTO dto, Tienda tienda) {
        if (dto == null || tienda == null) {
            return;
        }

        tienda.setNombre(dto.getNombre());
        tienda.setDireccion(dto.getDireccion());
        tienda.setTelefono(dto.getTelefono());
        tienda.setEmail(dto.getEmail());
        tienda.setAdministrador(dto.getAdministrador());
    }
}
