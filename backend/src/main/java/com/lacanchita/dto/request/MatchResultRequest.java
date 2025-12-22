package com.lacanchita.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class MatchResultRequest {
    private Integer golesLocal;
    private Integer golesVisitante;
    private List<GoalRequest> goles;

    @Data
    public static class GoalRequest {
        private Long jugadorId;
        private int cantidad;
    }
}
