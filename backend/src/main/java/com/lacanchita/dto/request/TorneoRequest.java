package com.lacanchita.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class TorneoRequest {
    private String nombre;
    private String categoria;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
}
