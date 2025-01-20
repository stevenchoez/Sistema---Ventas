package com.sistema.ventas.controller;

import com.sistema.ventas.dto.ApiResponse;
import com.sistema.ventas.dto.ClienteDTO;
import com.sistema.ventas.service.ClienteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@Tag(name = "Clientes", description = "API para la gestión de clientes")
@CrossOrigin(origins = "*")
public class ClienteController {
    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping
    @Operation(summary = "Listar todos los clientes")
    public ResponseEntity<ApiResponse<List<ClienteDTO>>> listarClientes() {
        List<ClienteDTO> clientes = clienteService.listarClientes();
        return ResponseEntity.ok(ApiResponse.success(clientes));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un cliente por su ID")
    public ResponseEntity<ApiResponse<ClienteDTO>> obtenerClientePorId(@PathVariable Long id) {
        ClienteDTO cliente = clienteService.obtenerClientePorId(id);
        return ResponseEntity.ok(ApiResponse.success(cliente));
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo cliente")
    public ResponseEntity<ApiResponse<ClienteDTO>> crearCliente(@Valid @RequestBody ClienteDTO clienteDTO) {
        ClienteDTO nuevoCliente = clienteService.crearCliente(clienteDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(nuevoCliente, "Cliente creado exitosamente"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un cliente existente")
    public ResponseEntity<ApiResponse<ClienteDTO>> actualizarCliente(
            @PathVariable Long id,
            @Valid @RequestBody ClienteDTO clienteDTO) {
        ClienteDTO clienteActualizado = clienteService.actualizarCliente(id, clienteDTO);
        return ResponseEntity.ok(ApiResponse.success(clienteActualizado, "Cliente actualizado exitosamente"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un cliente")
    public ResponseEntity<ApiResponse<String>> eliminarCliente(@PathVariable Long id) {
        clienteService.eliminarCliente(id);
        return ResponseEntity.ok(ApiResponse.success("Cliente eliminado exitosamente"));
    }
}
