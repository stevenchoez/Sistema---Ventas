package com.sistema.ventas.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ClienteDTO {
    private Long id;
    
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;
    
    @NotBlank(message = "La cédula es obligatoria")
    @Pattern(regexp = "^[0-9]{10}$", message = "La cédula debe tener 10 dígitos")
    private String identificacion;
    
    @NotBlank(message = "La dirección es obligatoria")
    private String direccion;
    
    @NotBlank(message = "El teléfono es obligatorio")
    @Pattern(regexp = "^[0-9]{10}$", message = "El teléfono debe tener 10 dígitos")
    private String telefono;
    
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe tener un formato válido")
    private String email;
}
