package com.sistema.ventas.exception;

public class NegocioException extends RuntimeException {
    public NegocioException(String mensaje) {
        super(mensaje);
    }

    public NegocioException(String mensaje, Throwable causa) {
        super(mensaje, causa);
    }
}
