package com.lacanchita.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Mensaje {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String email;
    private String asunto;

    @Column(length = 1000)
    private String contenido;

    @Enumerated(EnumType.STRING)
    private TipoMensaje tipo; // CONTACTO, QUEJA, SUGERENCIA

    private LocalDateTime fecha;

    public enum TipoMensaje {
        CONTACTO, QUEJA, SUGERENCIA
    }
}
