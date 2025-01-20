package com.sistema.ventas.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private T data;
    private String message;
    private boolean success;
    private List<ValidationError> errors;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ValidationError {
        private String field;
        private String message;
    }

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .data(data)
                .message("Operación exitosa")
                .success(true)
                .build();
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .data(data)
                .message(message)
                .success(true)
                .build();
    }

    public static ApiResponse<Void> error(String message) {
        return ApiResponse.<Void>builder()
                .message(message)
                .success(false)
                .build();
    }

    public static ApiResponse<Void> validationError(List<ValidationError> errors) {
        return ApiResponse.<Void>builder()
                .errors(errors)
                .message("Error de validación")
                .success(false)
                .build();
    }
}
