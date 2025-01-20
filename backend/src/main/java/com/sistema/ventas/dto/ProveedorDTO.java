package com.sistema.ventas.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import com.sistema.ventas.model.Proveedor;

@Data
public class ProveedorDTO {
    private Long id;
    
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;
    
    @NotBlank(message = "El RUC es obligatorio")
    @Pattern(regexp = "^[0-9]{13}$", message = "El RUC debe tener 13 dígitos")
    private String ruc;
    
    @NotBlank(message = "La dirección es obligatoria")
    private String direccion;
    
    @NotBlank(message = "El teléfono es obligatorio")
    @Pattern(regexp = "^[0-9]{10}$", message = "El teléfono debe tener 10 dígitos")
    private String telefono;
    
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe tener un formato válido")
    private String email;
    
    public Proveedor toEntity() {
        Proveedor proveedor = new Proveedor();
        proveedor.setId(this.id);
        proveedor.setNombre(this.nombre);
        proveedor.setRuc(this.ruc);
        proveedor.setDireccion(this.direccion);
        proveedor.setTelefono(this.telefono);
        proveedor.setEmail(this.email);
        return proveedor;
    }
}
