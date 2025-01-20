package com.sistema.ventas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SistemaVentasApplication {
    public static void main(String[] args) {
        SpringApplication.run(SistemaVentasApplication.class, args);
    }
}
