package com.lacanchita.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PlayerDTO {
    private Long id;
    private String nombre;
    private Integer numero;
    private String posicion;
}
