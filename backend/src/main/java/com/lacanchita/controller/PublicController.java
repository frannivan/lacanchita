package com.lacanchita.controller;

import com.lacanchita.dto.response.MatchDetailDTO;
import com.lacanchita.dto.response.StandingDTO;
import com.lacanchita.dto.response.TopScorerDTO;
import com.lacanchita.entity.Noticia;
import com.lacanchita.entity.Torneo;
import com.lacanchita.service.PublicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final PublicService publicService;

    @GetMapping("/noticias")
    public ResponseEntity<List<Noticia>> getNews() {
        return ResponseEntity.ok(publicService.getAllNoticias());
    }

    @PostMapping("/contacto")
    public ResponseEntity<?> createContactMessage(@RequestBody java.util.Map<String, String> request) {
        try {
            System.out.println("DEBUG: Received Contact Request (Map): " + request);
            String nombre = request.get("nombre");
            String email = request.get("email");
            String asunto = request.get("asunto");
            String contenido = request.get("contenido");
            String tipo = request.get("tipo");

            publicService.createMensaje(nombre, email, asunto, contenido, tipo);

            java.util.Map<String, String> response = new java.util.HashMap<>();
            response.put("message", "Mensaje enviado correctamente");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(java.util.Collections.singletonMap("error", e.getMessage()));
        }
    }

    @GetMapping("/torneos")
    public ResponseEntity<List<Torneo>> getActiveTournaments() {
        return ResponseEntity.ok(publicService.getAllTournaments());
    }

    @GetMapping("/torneos/{id}/tabla")
    public ResponseEntity<List<StandingDTO>> getStandings(@PathVariable Long id) {
        return ResponseEntity.ok(publicService.getStandings(id));
    }

    @GetMapping("/torneos/{id}/partidos/proximos")
    public ResponseEntity<List<MatchDetailDTO>> getUpcomingMatches(@PathVariable Long id) {
        return ResponseEntity.ok(publicService.getUpcomingMatches(id));
    }

    @GetMapping("/torneos/{id}/partidos/pasados")
    public ResponseEntity<List<MatchDetailDTO>> getPastMatches(@PathVariable Long id) {
        return ResponseEntity.ok(publicService.getPastMatches(id));
    }

    @GetMapping("/torneos/{id}/goleo")
    public ResponseEntity<List<TopScorerDTO>> getTopScorers(@PathVariable Long id) {
        return ResponseEntity.ok(publicService.getTopScorers(id));
    }

    @GetMapping("/torneos/{id}/equipos")
    public ResponseEntity<List<com.lacanchita.dto.response.TeamDTO>> getTeams(@PathVariable Long id) {
        return ResponseEntity.ok(publicService.getTeams(id));
    }

    @GetMapping("/partidos/{id}")
    public ResponseEntity<MatchDetailDTO> getMatchById(@PathVariable Long id) {
        return ResponseEntity.ok(publicService.getMatchById(id));
    }

    @GetMapping(value = "/partidos/{id}/share", produces = "text/html")
    public ResponseEntity<String> getMatchSharePage(@PathVariable Long id,
            jakarta.servlet.http.HttpServletRequest request) {

        // DEBUG: Print all headers
        System.out.println("----- DEBUG HEADERS -----");
        java.util.Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            System.out.println(headerName + ": " + request.getHeader(headerName));
        }
        System.out.println("-------------------------");
        String scheme = request.getHeader("X-Forwarded-Proto");
        if (scheme == null) {
            scheme = request.getScheme();
        }
        // Clean potentially multiple values (e.g. "https,http")
        if (scheme != null && scheme.contains(",")) {
            scheme = scheme.split(",")[0].trim();
        }

        String host = request.getHeader("X-Forwarded-Host");
        if (host == null) {
            host = request.getHeader("Host");
        }

        // Clean potentially multiple values (e.g. "host1, host2")
        if (host != null && host.contains(",")) {
            host = host.split(",")[0].trim();
        }

        String baseUrl = scheme + "://" + host;
        System.out.println("DEBUG: Generated Base URL: " + baseUrl); // Debug log

        return ResponseEntity.ok(publicService.generateMatchShareHtml(id, baseUrl));
    }

    @GetMapping(value = "/partidos/{id}/og-image", produces = org.springframework.http.MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getMatchOgImage(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(publicService.generateMatchOgImage(id));
        } catch (java.io.IOException e) {
            e.printStackTrace(); // Log error to console
            return ResponseEntity.internalServerError().build();
        }
    }
}
