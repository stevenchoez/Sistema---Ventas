package com.sistema.ventas.service;

import com.sistema.ventas.dto.TiendaDTO;
import com.sistema.ventas.exception.ResourceNotFoundException;
import com.sistema.ventas.mapper.TiendaMapper;
import com.sistema.ventas.model.Tienda;
import com.sistema.ventas.repository.TiendaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TiendaService {

    private final TiendaRepository tiendaRepository;
    private final TiendaMapper tiendaMapper;

    public TiendaDTO crearTienda(TiendaDTO tiendaDTO) {
        if (tiendaRepository.existsByNombre(tiendaDTO.getNombre())) {
            throw new ResourceNotFoundException("Ya existe una tienda con el nombre: " + tiendaDTO.getNombre());
        }
        Tienda tienda = tiendaMapper.toEntity(tiendaDTO);
        tienda = tiendaRepository.save(tienda);
        return tiendaMapper.toDTO(tienda);
    }

    public TiendaDTO actualizarTienda(Long id, TiendaDTO tiendaDTO) {
        Tienda tiendaExistente = tiendaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tienda no encontrada con id: " + id));

        if (!tiendaExistente.getNombre().equals(tiendaDTO.getNombre()) &&
            tiendaRepository.existsByNombre(tiendaDTO.getNombre())) {
            throw new ResourceNotFoundException("Ya existe una tienda con el nombre: " + tiendaDTO.getNombre());
        }

        tiendaExistente.setNombre(tiendaDTO.getNombre());
        tiendaExistente.setDireccion(tiendaDTO.getDireccion());
        tiendaExistente.setTelefono(tiendaDTO.getTelefono());
        tiendaExistente.setEmail(tiendaDTO.getEmail());
        tiendaExistente.setAdministrador(tiendaDTO.getAdministrador());

        tiendaExistente = tiendaRepository.save(tiendaExistente);
        return tiendaMapper.toDTO(tiendaExistente);
    }

    @Transactional(readOnly = true)
    public TiendaDTO obtenerTienda(Long id) {
        return tiendaMapper.toDTO(tiendaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tienda no encontrada con id: " + id)));
    }

    @Transactional(readOnly = true)
    public Tienda obtenerTiendaEntity(Long id) {
        return tiendaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tienda no encontrada con id: " + id));
    }

    @Transactional(readOnly = true)
    public List<TiendaDTO> listarTiendas() {
        return tiendaRepository.findAll().stream()
                .map(tiendaMapper::toDTO)
                .collect(Collectors.toList());
    }

    public void eliminarTienda(Long id) {
        if (!tiendaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Tienda no encontrada con id: " + id);
        }
        tiendaRepository.deleteById(id);
    }
}
