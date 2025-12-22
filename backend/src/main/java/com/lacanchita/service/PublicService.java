package com.lacanchita.service;

import com.lacanchita.dto.response.MatchDetailDTO;
import com.lacanchita.dto.response.StandingDTO;
import com.lacanchita.dto.response.TopScorerDTO;
import com.lacanchita.entity.*;
import com.lacanchita.entity.Partido.EstadoPartido;
import com.lacanchita.entity.Torneo.EstadoTorneo;
import com.lacanchita.exception.ResourceNotFoundException;
import com.lacanchita.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PublicService {

    private final TorneoRepository torneoRepository;
    private final PartidoRepository partidoRepository;
    private final EquipoRepository equipoRepository;
    private final GolRepository golRepository;
    private final NoticiaRepository noticiaRepository;
    private final MensajeRepository mensajeRepository; // Injected
    private final OGImageService ogImageService; // Injected

    // ... (existing methods remain unchanged) ...

    public byte[] generateMatchOgImage(Long id) throws java.io.IOException {
        MatchDetailDTO match = getMatchById(id);
        return ogImageService.generateMatchImage(match);
    }

    public String generateMatchShareHtml(Long id, String baseUrl) {
        MatchDetailDTO match = getMatchById(id);

        String title = match.getEquipoLocal() + " vs " + match.getEquipoVisitante();
        String description = "Torneo: " + match.getTorneoNombre() + " | Cancha: " + match.getCanchaNombre() +
                " | Fecha: " + match.getFecha() + " " + match.getHora();

        // Use our new dynamic image endpoint with ABSOLUTE URL
        String imageUrl = baseUrl + "/api/public/partidos/" + id + "/og-image";

        // Frontend URL to redirect to (Absolute for safety in FB crawler)
        String frontendUrl = baseUrl + "/partido/" + id;

        return "<!DOCTYPE html>\n" +
                "<html lang=\"es\">\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <title>" + title + "</title>\n" +
                "    <meta property=\"og:title\" content=\"" + title + "\" />\n" +
                "    <meta property=\"og:description\" content=\"" + description + "\" />\n" +
                "    <meta property=\"og:image\" content=\"" + imageUrl + "\" />\n" +
                "    <meta property=\"og:image:width\" content=\"1200\" />\n" +
                "    <meta property=\"og:image:height\" content=\"630\" />\n" +
                "    <meta property=\"og:url\" content=\"" + imageUrl.replace("/og-image", "/share") + "\" />\n" +
                "    <meta property=\"og:type\" content=\"website\" />\n" +
                "    <script>window.location.href = '" + frontendUrl + "';</script>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <p>Redirigiendo al partido...</p>\n" +
                "</body>\n" +
                "</html>";
    }

    public List<Torneo> getActiveTournaments() {
        return torneoRepository.findByEstado(EstadoTorneo.ACTIVO);
    }

    public List<Noticia> getAllNoticias() {
        // Return latest news (Limit could be applied here)
        return noticiaRepository.findAll(Sort.by(Sort.Direction.DESC, "fechaPublicacion"));
    }

    public List<Torneo> getAllTournaments() {
        return torneoRepository.findAll();
    }

    public List<StandingDTO> getStandings(Long torneoId) {
        if (!torneoRepository.existsById(torneoId)) {
            throw new ResourceNotFoundException("Torneo no encontrado");
        }

        List<Equipo> equipos = equipoRepository.findByTorneoId(torneoId);
        // Fetch matches ordered by date DESC (Latest first) to easily get last 5
        List<Partido> partidos = partidoRepository.findByTorneoIdAndEstadoOrderByFechaDesc(torneoId,
                EstadoPartido.JUGADO);

        Map<Long, StandingDTO> standingsMap = new HashMap<>();

        // Initialize standings
        for (Equipo equipo : equipos) {
            standingsMap.put(equipo.getId(), StandingDTO.builder()
                    .equipo(equipo.getNombre())
                    .juegosJugados(0)
                    .ganados(0)
                    .empatados(0)
                    .perdidos(0)
                    .golesFavor(0)
                    .golesContra(0)
                    .diferenciaGoles(0)
                    .puntos(0)
                    .ultimos5(new ArrayList<>())
                    .build());
        }

        // Process matches
        for (Partido partido : partidos) {
            Resultado resultado = partido.getResultado();
            if (resultado == null)
                continue;

            updateTeamStats(standingsMap.get(partido.getEquipoLocal().getId()),
                    resultado.getGolesLocal(), resultado.getGolesVisitante());

            updateTeamStats(standingsMap.get(partido.getEquipoVisitante().getId()),
                    resultado.getGolesVisitante(), resultado.getGolesLocal());
        }

        // Convert to list and sort
        return standingsMap.values().stream()
                .peek(s -> Collections.reverse(s.getUltimos5())) // Reverse to show Oldest -> Newest
                .sorted((s1, s2) -> {
                    if (s2.getPuntos() != s1.getPuntos())
                        return s2.getPuntos() - s1.getPuntos();
                    if (s2.getDiferenciaGoles() != s1.getDiferenciaGoles())
                        return s2.getDiferenciaGoles() - s1.getDiferenciaGoles();
                    return s2.getGolesFavor() - s1.getGolesFavor();
                })
                .peek(s -> s.setPosicion(0)) // Will set explicitly if needed, handled by index in frontend
                .collect(Collectors.toList());
    }

    // Helper to calculate stats
    private void updateTeamStats(StandingDTO stats, int goalsFor, int goalsAgainst) {
        if (stats == null)
            return;

        stats.setJuegosJugados(stats.getJuegosJugados() + 1);
        stats.setGolesFavor(stats.getGolesFavor() + goalsFor);
        stats.setGolesContra(stats.getGolesContra() + goalsAgainst);
        stats.setDiferenciaGoles(stats.getGolesFavor() - stats.getGolesContra());

        String result;
        if (goalsFor > goalsAgainst) {
            stats.setGanados(stats.getGanados() + 1);
            stats.setPuntos(stats.getPuntos() + 3);
            result = "G";
        } else if (goalsFor == goalsAgainst) {
            stats.setEmpatados(stats.getEmpatados() + 1);
            stats.setPuntos(stats.getPuntos() + 1);
            result = "E";
        } else {
            stats.setPerdidos(stats.getPerdidos() + 1);
            result = "P";
        }

        // Add to last 5 if we have less than 5
        if (stats.getUltimos5().size() < 5) {
            stats.getUltimos5().add(result);
        }
    }

    public List<MatchDetailDTO> getUpcomingMatches(Long torneoId) {
        List<Partido> partidos = partidoRepository.findByTorneoIdAndFechaAfterOrderByFechaAsc(
                torneoId, LocalDate.now().minusDays(1)); // Include today

        // Filter out finished matches just in case
        return partidos.stream()
                .filter(p -> p.getEstado() != EstadoPartido.JUGADO)
                .map(this::mapToMatchDTO)
                .collect(Collectors.toList());
    }

    public List<MatchDetailDTO> getPastMatches(Long torneoId) {
        List<Partido> partidos = partidoRepository.findByTorneoIdAndEstadoOrderByFechaDesc(
                torneoId, EstadoPartido.JUGADO);

        return partidos.stream()
                .map(this::mapToMatchDTO)
                .collect(Collectors.toList());
    }

    public List<TopScorerDTO> getTopScorers(Long torneoId) {
        List<Gol> goles = golRepository.findByTorneoId(torneoId);

        Map<Long, TopScorerDTO> scorersMap = new HashMap<>();

        for (Gol gol : goles) {
            Long jugadorId = gol.getJugador().getId();
            scorersMap.computeIfAbsent(jugadorId, k -> TopScorerDTO.builder()
                    .jugador(gol.getJugador().getNombre())
                    .equipo(gol.getJugador().getEquipo().getNombre())
                    .goles(0L)
                    .build());

            TopScorerDTO scorer = scorersMap.get(jugadorId);
            scorer.setGoles(scorer.getGoles() + 1);
        }

        return scorersMap.values().stream()
                .sorted((s1, s2) -> Long.compare(s2.getGoles(), s1.getGoles()))
                .limit(10)
                .collect(Collectors.toList());
    }

    public List<com.lacanchita.dto.response.TeamDTO> getTeams(Long torneoId) {
        if (!torneoRepository.existsById(torneoId)) {
            throw new ResourceNotFoundException("Torneo no encontrado");
        }
        return equipoRepository.findByTorneoId(torneoId).stream()
                .map(e -> com.lacanchita.dto.response.TeamDTO.builder()
                        .id(e.getId())
                        .nombre(e.getNombre())
                        .build())
                .collect(Collectors.toList());
    }

    public MatchDetailDTO getMatchById(Long id) {
        Partido partido = partidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Partido no encontrado"));
        return mapToMatchDTO(partido);
    }

    private MatchDetailDTO mapToMatchDTO(Partido p) {
        Integer gl = p.getResultado() != null ? p.getResultado().getGolesLocal() : null;
        Integer gv = p.getResultado() != null ? p.getResultado().getGolesVisitante() : null;

        return MatchDetailDTO.builder()
                .id(p.getId())
                .torneoNombre(p.getTorneo().getNombre())
                .categoria(p.getTorneo().getCategoria())
                .equipoLocal(p.getEquipoLocal().getNombre())
                .equipoVisitante(p.getEquipoVisitante().getNombre())
                .canchaNombre(p.getCancha().getNombre())
                .fecha(p.getFecha())
                .hora(p.getHora())
                .arbitro(p.getArbitro())
                .tipoPartido(p.getTipoPartido())
                .estado(p.getEstado().name())
                .golesLocal(gl)
                .golesVisitante(gv)
                .build();
    }

    @org.springframework.transaction.annotation.Transactional(rollbackFor = Exception.class)
    public void createMensaje(String nombre, String email, String asunto, String contenido, String tipo) {
        System.out.println("DEBUG: Saving Mensaje - START");
        Mensaje mensaje = Mensaje.builder()
                .nombre(nombre)
                .email(email)
                .asunto(asunto)
                .contenido(contenido)
                .tipo(Mensaje.TipoMensaje.valueOf(tipo))
                .fecha(java.time.LocalDateTime.now())
                .build();
        mensajeRepository.save(mensaje);
        mensajeRepository.flush(); // Force write to DB immediately
        System.out.println("DEBUG: Mensaje Saved & Flushed. ID: " + mensaje.getId());
    }
}
