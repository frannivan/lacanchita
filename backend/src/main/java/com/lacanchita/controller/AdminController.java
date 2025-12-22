package com.lacanchita.controller;

import com.lacanchita.dto.request.CanchaRequest;
import com.lacanchita.dto.request.TorneoRequest;
import com.lacanchita.dto.request.*;
import com.lacanchita.dto.response.*;
import com.lacanchita.dto.response.PagoEquipoDTO;
import com.lacanchita.entity.Cancha;
import com.lacanchita.entity.Noticia;
import com.lacanchita.entity.Partido;
import com.lacanchita.entity.Torneo;
import com.lacanchita.entity.PagoEquipo;
import com.lacanchita.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import com.lacanchita.dto.request.MatchResultRequest;
import com.lacanchita.dto.response.MatchPlayersDTO;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // --- NOTICIAS ---
    @PostMapping("/noticias")
    public ResponseEntity<Noticia> createNoticia(@RequestBody NoticiaRequest request) {
        return ResponseEntity.ok(adminService.createNoticia(request));
    }

    @DeleteMapping("/noticias/{id}")
    public ResponseEntity<Void> deleteNoticia(@PathVariable Long id) {
        adminService.deleteNoticia(id);
        return ResponseEntity.ok().build();
    }

    // --- MENSAJES ---
    @GetMapping("/mensajes")
    public ResponseEntity<List<com.lacanchita.entity.Mensaje>> getAllMensajes() {
        return ResponseEntity.ok(adminService.getAllMensajes());
    }

    // --- CANCHAS ---
    @PostMapping("/canchas")
    public ResponseEntity<Cancha> createCancha(@RequestBody CanchaRequest request) {
        return ResponseEntity.ok(adminService.createCancha(request));
    }

    @GetMapping("/canchas")
    public ResponseEntity<List<Cancha>> getAllCanchas() {
        return ResponseEntity.ok(adminService.getAllCanchas());
    }

    @PutMapping("/canchas/{id}")
    public ResponseEntity<Cancha> updateCancha(@PathVariable Long id, @RequestBody CanchaRequest request) {
        return ResponseEntity.ok(adminService.updateCancha(id, request));
    }

    @DeleteMapping("/canchas/{id}")
    public ResponseEntity<Void> deleteCancha(@PathVariable Long id) {
        adminService.deleteCancha(id);
        return ResponseEntity.ok().build();
    }

    // --- TORNEOS ---
    @PostMapping("/torneos")
    public ResponseEntity<Torneo> createTorneo(@RequestBody TorneoRequest request) {
        return ResponseEntity.ok(adminService.createTorneo(request));
    }

    @DeleteMapping("/torneos/{id}")
    public ResponseEntity<Void> deleteTorneo(@PathVariable Long id) {
        adminService.deleteTorneo(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/torneos/{id}")
    public ResponseEntity<Torneo> updateTorneo(@PathVariable Long id, @RequestBody TorneoRequest request) {
        return ResponseEntity.ok(adminService.updateTorneo(id, request));
    }

    // --- TEAMS & PLAYERS ---
    @PostMapping("/torneos/{id}/equipos")
    public ResponseEntity<?> createEquipo(@PathVariable Long id, @RequestParam String nombre,
            @RequestParam String directorTecnico) {
        return ResponseEntity.ok(adminService.createEquipo(id, nombre, directorTecnico));
    }

    @GetMapping("/equipos")
    public ResponseEntity<List<TeamDTO>> getAllTeams() {
        return ResponseEntity.ok(adminService.getAllTeams());
    }

    // --- PARTIDOS ---
    @PostMapping("/partidos/programar")
    public ResponseEntity<Partido> scheduleMatch(@RequestParam Long torneoId, @RequestParam Long localId,
            @RequestParam Long visitanteId, @RequestParam Long canchaId,
            @RequestParam String fecha, @RequestParam String hora,
            @RequestParam String arbitro, @RequestParam String tipo) {
        return ResponseEntity.ok(adminService.scheduleMatch(
                torneoId, localId, visitanteId, canchaId,
                LocalDate.parse(fecha), LocalTime.parse(hora), arbitro, tipo));
    }

    @PostMapping("/partidos/{id}/resultado")
    public ResponseEntity<Partido> registerResult(@PathVariable Long id, @RequestBody MatchResultRequest request) {
        return ResponseEntity.ok(adminService.registerResult(id, request));
    }

    @PostMapping("/partidos/{id}/goles")
    public ResponseEntity<?> addGoal(@PathVariable Long id, @RequestParam Long jugadorId, @RequestParam int minuto) {
        adminService.addGoal(id, jugadorId, minuto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/partidos/{id}/posponer")
    public ResponseEntity<?> postponeMatch(@PathVariable Long id, @RequestParam String fecha,
            @RequestParam String hora) {
        adminService.postponeMatch(id, LocalDate.parse(fecha), LocalTime.parse(hora));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/partidos/{id}/cancelar")
    public ResponseEntity<Partido> cancelMatch(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.cancelMatch(id));
    }

    @DeleteMapping("/partidos/{id}")
    public ResponseEntity<Void> deleteMatch(@PathVariable Long id) {
        adminService.deleteMatch(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/partidos/{id}/jugadores")
    public ResponseEntity<MatchPlayersDTO> getPlayersByMatch(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getPlayersByMatch(id));
    }

    @GetMapping("/torneos/{id}/partidos")
    public ResponseEntity<List<com.lacanchita.dto.response.MatchDetailDTO>> getMatchesByTorneo(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getMatchesByTorneo(id));
    }

    // --- PAYMENTS ---
    @PostMapping("/equipos/{id}/pagos")
    public ResponseEntity<Void> registerPayment(@PathVariable Long id, @RequestParam java.math.BigDecimal monto,
            @RequestParam String descripcion) {
        adminService.registerPayment(id, monto, descripcion);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/pagos")
    public ResponseEntity<List<PagoEquipoDTO>> getAllPagos() {
        return ResponseEntity.ok(adminService.getAllPagosEquipos());
    }

    // --- PLAYERS ---
    @GetMapping("/equipos/{id}/jugadores")
    public ResponseEntity<List<PlayerDTO>> getPlayersByTeam(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getPlayersByTeam(id));
    }

    @PostMapping("/equipos/{id}/jugadores")
    public ResponseEntity<PlayerDTO> addPlayer(@PathVariable Long id, @RequestParam String nombre,
            @RequestParam int numero, @RequestParam String posicion) {
        return ResponseEntity.ok(adminService.addPlayer(id, nombre, numero, posicion));
    }

    @DeleteMapping("/jugadores/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable Long id) {
        adminService.removePlayer(id);
        return ResponseEntity.ok().build();
    }
}
