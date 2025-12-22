package com.lacanchita.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "adeudos_equipos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdeudoEquipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipo_id", nullable = false)
    private Equipo equipo;

    @Column(name = "monto_pendiente", nullable = false)
    private BigDecimal montoPendiente;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDate fechaRegistro;
}
