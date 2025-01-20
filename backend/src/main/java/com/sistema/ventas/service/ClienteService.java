package com.sistema.ventas.service;

import com.sistema.ventas.dto.ClienteDTO;
import com.sistema.ventas.exception.NegocioException;
import com.sistema.ventas.model.Cliente;
import com.sistema.ventas.repository.ClienteRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ClienteService {
    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public List<ClienteDTO> listarClientes() {
        return clienteRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public ClienteDTO obtenerClientePorId(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new NegocioException("Cliente no encontrado con ID: " + id));
        return convertirADTO(cliente);
    }

    public Cliente obtenerClienteEntity(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new NegocioException("Cliente no encontrado con ID: " + id));
    }

    public ClienteDTO crearCliente(ClienteDTO clienteDTO) {
        validarClienteUnico(clienteDTO);
        Cliente cliente = new Cliente();
        BeanUtils.copyProperties(clienteDTO, cliente);
        cliente = clienteRepository.save(cliente);
        return convertirADTO(cliente);
    }

    public ClienteDTO actualizarCliente(Long id, ClienteDTO clienteDTO) {
        Cliente clienteExistente = clienteRepository.findById(id)
                .orElseThrow(() -> new NegocioException("Cliente no encontrado con ID: " + id));
        
        validarClienteUnicoParaActualizacion(id, clienteDTO);
        BeanUtils.copyProperties(clienteDTO, clienteExistente, "id");
        Cliente clienteActualizado = clienteRepository.save(clienteExistente);
        return convertirADTO(clienteActualizado);
    }

    public void eliminarCliente(Long id) {
        if (!clienteRepository.existsById(id)) {
            throw new NegocioException("Cliente no encontrado con ID: " + id);
        }
        clienteRepository.deleteById(id);
    }

    private void validarClienteUnico(ClienteDTO clienteDTO) {
        if (clienteRepository.existsByIdentificacion(clienteDTO.getIdentificacion())) {
            throw new NegocioException("La identificación ya está registrada");
        }
        if (clienteDTO.getEmail() != null && clienteRepository.existsByEmail(clienteDTO.getEmail())) {
            throw new NegocioException("El correo electrónico ya está registrado");
        }
    }

    private void validarClienteUnicoParaActualizacion(Long id, ClienteDTO clienteDTO) {
        if (clienteRepository.existsByIdentificacionAndIdNot(clienteDTO.getIdentificacion(), id)) {
            throw new NegocioException("La identificación ya está registrada");
        }
        if (clienteDTO.getEmail() != null && clienteRepository.existsByEmailAndIdNot(clienteDTO.getEmail(), id)) {
            throw new NegocioException("El correo electrónico ya está registrado");
        }
    }

    private ClienteDTO convertirADTO(Cliente cliente) {
        ClienteDTO dto = new ClienteDTO();
        BeanUtils.copyProperties(cliente, dto);
        return dto;
    }
}
