package com.sistema.ventas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseDTO<T> {
    private T data;
    private String message;
    private boolean success;
    private String[] errors;

    public ResponseDTO(T data, String message, boolean success) {
        this.data = data;
        this.message = message;
        this.success = success;
        this.errors = null;
    }
}
