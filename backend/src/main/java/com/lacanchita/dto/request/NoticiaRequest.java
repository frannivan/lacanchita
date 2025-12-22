package com.lacanchita.dto.request;

import lombok.Data;

@Data
public class NoticiaRequest {
    private String titulo;
    private String contenido;
    private String imagenUrl;
}
