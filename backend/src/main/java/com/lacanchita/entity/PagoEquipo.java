package com.lacanchita.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "pagos_equipos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PagoEquipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipo_id", nullable = false)
    private Equipo equipo;

    @Column(nullable = false)
    private BigDecimal monto;

    @Column(name = "fecha_pago", nullable = false)
    private LocalDate fechaPago;

    private String descripcion;

    @Column(name = "fecha_creacion", updatable = false)
    private java.time.LocalDate fechaCreacion;

    @PrePersist
    public void prePersist() {
        this.fechaCreacion = java.time.LocalDate.now();
    }
}
