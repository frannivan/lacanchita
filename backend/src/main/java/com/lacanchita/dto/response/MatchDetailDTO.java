package com.lacanchita.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
public class MatchDetailDTO {
    private Long id;
    private String torneoNombre;
    private String categoria;
    private String equipoLocal;
    private String equipoVisitante;
    private String canchaNombre;
    private LocalDate fecha;
    private LocalTime hora;
    private String arbitro;
    private String tipoPartido;
    private String estado;
    private Integer golesLocal;
    private Integer golesVisitante;
}
