package com.lacanchita.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StandingDTO {
    private int posicion;
    private String equipo;
    private int juegosJugados;
    private int ganados;
    private int empatados;
    private int perdidos;
    private int golesFavor;
    private int golesContra;
    private int diferenciaGoles;
    private int puntos;
    private java.util.List<String> ultimos5;
}
