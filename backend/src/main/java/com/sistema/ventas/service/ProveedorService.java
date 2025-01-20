package com.sistema.ventas.service;

import com.sistema.ventas.dto.ProveedorDTO;
import com.sistema.ventas.exception.NegocioException;
import com.sistema.ventas.model.Proveedor;
import com.sistema.ventas.repository.ProveedorRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProveedorService {
    private final ProveedorRepository proveedorRepository;

    public ProveedorService(ProveedorRepository proveedorRepository) {
        this.proveedorRepository = proveedorRepository;
    }

    public List<ProveedorDTO> listarProveedores() {
        return proveedorRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public ProveedorDTO obtenerProveedorPorId(Long id) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new NegocioException("Proveedor no encontrado con ID: " + id));
        return convertirADTO(proveedor);
    }

    public ProveedorDTO crearProveedor(ProveedorDTO proveedorDTO) {
        validarProveedorUnico(proveedorDTO);
        Proveedor proveedor = new Proveedor();
        BeanUtils.copyProperties(proveedorDTO, proveedor);
        proveedor = proveedorRepository.save(proveedor);
        return convertirADTO(proveedor);
    }

    public ProveedorDTO actualizarProveedor(Long id, ProveedorDTO proveedorDTO) {
        Proveedor proveedorExistente = proveedorRepository.findById(id)
                .orElseThrow(() -> new NegocioException("Proveedor no encontrado con ID: " + id));
        
        if (!proveedorExistente.getRuc().equals(proveedorDTO.getRuc())) {
            validarProveedorUnico(proveedorDTO);
        }

        BeanUtils.copyProperties(proveedorDTO, proveedorExistente, "id");
        proveedorExistente = proveedorRepository.save(proveedorExistente);
        return convertirADTO(proveedorExistente);
    }

    public void eliminarProveedor(Long id) {
        if (!proveedorRepository.existsById(id)) {
            throw new NegocioException("Proveedor no encontrado con ID: " + id);
        }
        proveedorRepository.deleteById(id);
    }

    private void validarProveedorUnico(ProveedorDTO proveedorDTO) {
        if (proveedorRepository.existsByRuc(proveedorDTO.getRuc())) {
            throw new NegocioException("Ya existe un proveedor con el RUC: " + proveedorDTO.getRuc());
        }
        if (proveedorRepository.existsByEmail(proveedorDTO.getEmail())) {
            throw new NegocioException("Ya existe un proveedor con el email: " + proveedorDTO.getEmail());
        }
    }

    private ProveedorDTO convertirADTO(Proveedor proveedor) {
        ProveedorDTO dto = new ProveedorDTO();
        BeanUtils.copyProperties(proveedor, dto);
        return dto;
    }
}
