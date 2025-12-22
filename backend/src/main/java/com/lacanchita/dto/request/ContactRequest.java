package com.lacanchita.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactRequest {
    private String nombre;
    private String email;
    private String asunto;
    private String contenido;
    private String tipo;
}
