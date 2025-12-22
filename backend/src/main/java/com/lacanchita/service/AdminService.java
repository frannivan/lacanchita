package com.lacanchita.service;

import com.lacanchita.dto.request.*;
import com.lacanchita.dto.response.*;
import com.lacanchita.dto.response.PagoEquipoDTO;
import com.lacanchita.entity.*;
import com.lacanchita.entity.Partido.EstadoPartido;
import com.lacanchita.exception.ResourceNotFoundException;
import com.lacanchita.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final CanchaRepository canchaRepository;
    private final TorneoRepository torneoRepository;
    private final EquipoRepository equipoRepository;
    private final JugadorRepository jugadorRepository;
    private final PartidoRepository partidoRepository;
    private final ResultadoRepository resultadoRepository;
    private final GolRepository golRepository;
    private final PagoEquipoRepository pagoEquipoRepository;
    private final MensajeRepository mensajeRepository;
    private final NoticiaRepository noticiaRepository;

    // --- NOTICIAS ---
    public Noticia createNoticia(NoticiaRequest request) {
        Noticia noticia = Noticia.builder()
                .titulo(request.getTitulo())
                .contenido(request.getContenido())
                .imagenUrl(request.getImagenUrl())
                .fechaPublicacion(LocalDateTime.now())
                .build();
        return noticiaRepository.save(noticia);
    }

    public void deleteNoticia(Long id) {
        if (!noticiaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Noticia no encontrada");
        }
        noticiaRepository.deleteById(id);
    }

    // --- CANCHAS ---
    public Cancha createCancha(CanchaRequest request) {
        Cancha cancha = Cancha.builder()
                .nombre(request.getNombre())
                .ubicacion(request.getUbicacion())
                .activa(true)
                .build();
        return canchaRepository.save(cancha);
    }

    public List<Cancha> getAllCanchas() {
        return canchaRepository.findAll();
    }

    public void deleteCancha(Long id) {
        if (!canchaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cancha no encontrada");
        }
        canchaRepository.deleteById(id);
    }

    public Cancha updateCancha(Long id, CanchaRequest request) {
        Cancha cancha = canchaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cancha no encontrada"));
        cancha.setNombre(request.getNombre());
        cancha.setUbicacion(request.getUbicacion());
        return canchaRepository.save(cancha);
    }

    // --- TORNEOS ---
    public Torneo createTorneo(TorneoRequest request) {
        Torneo torneo = Torneo.builder()
                .nombre(request.getNombre())
                .categoria(request.getCategoria())
                .fechaInicio(request.getFechaInicio())
                .fechaFin(request.getFechaFin())
                .estado(Torneo.EstadoTorneo.ACTIVO)
                .build();
        return torneoRepository.save(torneo);
    }

    public void deleteTorneo(Long id) {
        if (!torneoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Torneo no encontrado");
        }
        torneoRepository.deleteById(id);
    }

    public Torneo updateTorneo(Long id, TorneoRequest request) {
        Torneo torneo = torneoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Torneo no encontrado"));
        torneo.setNombre(request.getNombre());
        torneo.setCategoria(request.getCategoria());
        torneo.setFechaInicio(request.getFechaInicio());
        torneo.setFechaFin(request.getFechaFin());
        return torneoRepository.save(torneo);
    }

    // --- EQUIPOS ---
    public Equipo createEquipo(Long torneoId, String nombre, String directorTecnico) {
        Torneo torneo = torneoRepository.findById(torneoId)
                .orElseThrow(() -> new ResourceNotFoundException("Torneo no encontrado"));
        Equipo equipo = Equipo.builder()
                .nombre(nombre)
                .directorTecnico(directorTecnico)
                .torneo(torneo)
                .build();
        return equipoRepository.save(equipo);
    }

    public List<TeamDTO> getAllTeams() {
        return equipoRepository.findAll().stream()
                .map(this::mapToTeamDTO)
                .collect(Collectors.toList());
    }

    private TeamDTO mapToTeamDTO(Equipo e) {
        return TeamDTO.builder()
                .id(e.getId())
                .nombre(e.getNombre())
                .build();
    }

    // --- MENSAJES ---
    public List<Mensaje> getAllMensajes() {
        return mensajeRepository.findAllByOrderByFechaDesc();
    }

    // --- JUGADORES (ROSTER) ---
    // Alias for existing controller calls if any
    public PlayerDTO addJugador(Long equipoId, String nombre, int numero, String posicion) {
        return addPlayer(equipoId, nombre, numero, posicion);
    }

    public PlayerDTO addPlayer(Long equipoId, String nombre, int numero, String posicion) {
        Equipo equipo = equipoRepository.findById(equipoId)
                .orElseThrow(() -> new ResourceNotFoundException("Equipo no encontrado"));
        Jugador jugador = Jugador.builder()
                .equipo(equipo)
                .nombre(nombre)
                .numero(numero)
                .posicion(posicion)
                .build();
        jugador = jugadorRepository.save(jugador);
        return mapToPlayerDTO(jugador);
    }

    public List<PlayerDTO> getPlayersByTeam(Long equipoId) {
        // Use ID directly to avoid repository signature mismatch issues
        return jugadorRepository.findByEquipoId(equipoId).stream()
                .map(this::mapToPlayerDTO)
                .collect(Collectors.toList());
    }

    public void removePlayer(Long playerId) {
        if (!jugadorRepository.existsById(playerId)) {
            throw new ResourceNotFoundException("Jugador no encontrado");
        }
        jugadorRepository.deleteById(playerId);
    }

    // --- MATCHES ---
    public Partido scheduleMatch(Long torneoId, Long localId, Long visitanteId, Long canchaId,
            LocalDate fecha, LocalTime hora, String arbitro, String tipo) {
        Torneo torneo = torneoRepository.findById(torneoId).orElseThrow();
        Equipo local = equipoRepository.findById(localId).orElseThrow();
        Equipo visita = equipoRepository.findById(visitanteId).orElseThrow();
        Cancha cancha = canchaRepository.findById(canchaId).orElseThrow();

        Partido partido = Partido.builder()
                .torneo(torneo)
                .equipoLocal(local)
                .equipoVisitante(visita)
                .cancha(cancha)
                .fecha(fecha)
                .hora(hora)
                .arbitro(arbitro)
                .tipoPartido(tipo)
                .estado(EstadoPartido.PROGRAMADO)
                .build();
        return partidoRepository.save(partido);
    }

    public void addGoal(Long partidoId, Long jugadorId, int minuto) {
        Partido partido = partidoRepository.findById(partidoId).orElseThrow();
        Jugador jugador = jugadorRepository.findById(jugadorId).orElseThrow();

        Gol gol = Gol.builder()
                .partido(partido)
                .jugador(jugador)
                .minuto(minuto)
                .build();
        golRepository.save(gol);
    }

    public Partido registerResult(Long id, MatchResultRequest request) {
        Partido partido = partidoRepository.findById(id).orElseThrow();

        Resultado resultado = partido.getResultado();
        if (resultado == null) {
            resultado = new Resultado();
            resultado.setPartido(partido);
        }
        resultado.setGolesLocal(request.getGolesLocal());
        resultado.setGolesVisitante(request.getGolesVisitante());
        resultado = resultadoRepository.save(resultado);

        partido.setResultado(resultado);
        partido.setEstado(EstadoPartido.JUGADO);

        // Save Goals
        if (request.getGoles() != null) {
            for (MatchResultRequest.GoalRequest gr : request.getGoles()) {
                Jugador j = jugadorRepository.findById(gr.getJugadorId()).orElseThrow();
                for (int k = 0; k < gr.getCantidad(); k++) {
                    Gol g = Gol.builder()
                            .partido(partido)
                            .jugador(j)
                            .minuto(0) // Placeholder
                            .build();
                    golRepository.save(g);
                }
            }
        }

        return partidoRepository.save(partido);
    }

    public MatchPlayersDTO getPlayersByMatch(Long partidoId) {
        Partido partido = partidoRepository.findById(partidoId).orElseThrow();
        List<PlayerDTO> localPlayers = getPlayersByTeam(partido.getEquipoLocal().getId());
        List<PlayerDTO> visitorPlayers = getPlayersByTeam(partido.getEquipoVisitante().getId());

        return MatchPlayersDTO.builder()
                .localPlayers(localPlayers)
                .visitorPlayers(visitorPlayers)
                .build();
    }

    public void deleteMatch(Long id) {
        if (!partidoRepository.existsById(id))
            throw new ResourceNotFoundException("Partido no encontrado");
        partidoRepository.deleteById(id);
    }

    public Partido postponeMatch(Long id, LocalDate fecha, LocalTime hora) {
        Partido p = partidoRepository.findById(id).orElseThrow();
        p.setFecha(fecha);
        p.setHora(hora);
        p.setEstado(EstadoPartido.POSPUESTO);
        return partidoRepository.save(p);
    }

    public Partido cancelMatch(Long id) {
        Partido p = partidoRepository.findById(id).orElseThrow();
        p.setEstado(EstadoPartido.CANCELADO);
        return partidoRepository.save(p);
    }

    public List<MatchDetailDTO> getMatchesByTorneo(Long torneoId) {
        return partidoRepository.findByTorneoId(torneoId).stream()
                .map(this::mapToMatchDetailDTO)
                .collect(Collectors.toList());
    }

    // --- PAGOS ---
    public PagoEquipo registerPayment(Long equipoId, java.math.BigDecimal monto, String descripcion) {
        Equipo equipo = equipoRepository.findById(equipoId).orElseThrow();
        PagoEquipo pago = PagoEquipo.builder()
                .equipo(equipo)
                .monto(monto)
                .fechaPago(LocalDate.now())
                .descripcion(descripcion)
                .build();
        return pagoEquipoRepository.save(pago);
    }

    public List<PagoEquipoDTO> getAllPagosEquipos() {
        return pagoEquipoRepository.findAll().stream()
                .map(this::mapToPagoEquipoDTO)
                .collect(Collectors.toList());
    }

    private PagoEquipoDTO mapToPagoEquipoDTO(PagoEquipo p) {
        return PagoEquipoDTO.builder()
                .id(p.getId())
                .equipoId(p.getEquipo().getId())
                .equipoNombre(p.getEquipo().getNombre())
                .monto(p.getMonto())
                .descripcion(p.getDescripcion())
                .fechaPago(p.getFechaPago())
                .build();
    }

    // --- MAPPERS ---
    private PlayerDTO mapToPlayerDTO(Jugador j) {
        return PlayerDTO.builder()
                .id(j.getId())
                .nombre(j.getNombre())
                .numero(j.getNumero())
                .posicion(j.getPosicion())
                .build();
    }

    private MatchDetailDTO mapToMatchDetailDTO(Partido p) {
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
}
