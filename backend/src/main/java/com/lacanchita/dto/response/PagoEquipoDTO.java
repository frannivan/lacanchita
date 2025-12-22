package com.lacanchita.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class PagoEquipoDTO {
    private Long id;
    private String equipoNombre;
    private Long equipoId;
    private BigDecimal monto;
    private String descripcion;
    private LocalDate fechaPago;
}
