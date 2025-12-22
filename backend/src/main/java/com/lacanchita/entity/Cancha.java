package com.lacanchita.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "canchas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cancha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String ubicacion;

    @Column(nullable = false)
    private boolean activa;

    @Column(name = "fecha_creacion", updatable = false)
    private java.time.LocalDate fechaCreacion;

    @PrePersist
    public void prePersist() {
        this.fechaCreacion = java.time.LocalDate.now();
    }
}
