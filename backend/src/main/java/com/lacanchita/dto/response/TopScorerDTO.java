package com.lacanchita.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TopScorerDTO {
    private String jugador;
    private String equipo;
    private Long goles;
}
