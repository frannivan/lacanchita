package com.lacanchita.config;

import com.lacanchita.entity.*;
import com.lacanchita.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final CanchaRepository canchaRepository;
    private final TorneoRepository torneoRepository;
    private final EquipoRepository equipoRepository;
    private final JugadorRepository jugadorRepository;
    private final PartidoRepository partidoRepository;
    private final ResultadoRepository resultadoRepository;
    private final GolRepository golRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedAdminUser(); // Always ensure admin exists with correct password
        if (canchaRepository.count() == 0) {
            seedCanchas();
            seedTorneoAndTeams();
        }
    }

    private void seedAdminUser() {
        // Check if admin exists
        usuarioRepository.findByUsername("admin").ifPresentOrElse(
                user -> {
                    // Reset password ensuring it's always "admin123"
                    user.setPassword(passwordEncoder.encode("admin123"));
                    usuarioRepository.save(user);
                    System.out.println("Admin password reset to: admin123");
                },
                () -> {
                    // Create if not exists
                    Usuario admin = Usuario.builder()
                            .username("admin")
                            .password(passwordEncoder.encode("admin123"))
                            .role(Usuario.Role.ADMIN)
                            .build();
                    usuarioRepository.save(admin);
                    System.out.println("Admin user created: admin / admin123");
                });
    }

    private void seedCanchas() {
        canchaRepository.saveAll(Arrays.asList(
                Cancha.builder().nombre("Cancha 1 - Principal").ubicacion("Zona Norte").activa(true).build(),
                Cancha.builder().nombre("Cancha 2 - Sintética").ubicacion("Zona Sur").activa(true).build(),
                Cancha.builder().nombre("Cancha 3 - 7v7").ubicacion("Zona Este").activa(true).build()));
    }

    private void seedTorneoAndTeams() {
        Torneo torneo = Torneo.builder()
                .nombre("Torneo de Verano 2025")
                .categoria("Libre")
                .fechaInicio(LocalDate.now().minusWeeks(2))
                .fechaFin(LocalDate.now().plusWeeks(2))
                .estado(Torneo.EstadoTorneo.ACTIVO)
                .build();
        torneoRepository.save(torneo);

        Equipo e1 = createEquipo(torneo, "Los Rayos", "Juan Pérez");
        Equipo e2 = createEquipo(torneo, "Furia Roja", "Carlos López");
        Equipo e3 = createEquipo(torneo, "Atlético San Pancho", "Pedro M.");
        Equipo e4 = createEquipo(torneo, "Galácticos", "Zidane");

        // Seed Players
        createJugador(e1, "Messi Jr", 10, "Delantero");
        createJugador(e1, "El Portero", 1, "Portero");
        createJugador(e2, "Cristiano Jr", 7, "Delantero");
        createJugador(e3, "Chicharito", 14, "Delantero");

        // Seed Matches
        List<Cancha> canchas = canchaRepository.findAll();

        // Match 1: Finished
        Partido p1 = Partido.builder()
                .torneo(torneo).equipoLocal(e1).equipoVisitante(e2)
                .cancha(canchas.get(0)).fecha(LocalDate.now().minusDays(5))
                .hora(LocalTime.of(18, 0)).arbitro("Luis E.")
                .tipoPartido("JORNADA 1").estado(Partido.EstadoPartido.JUGADO)
                .build();
        partidoRepository.save(p1);

        Resultado r1 = Resultado.builder().partido(p1).golesLocal(2).golesVisitante(1).build();
        resultadoRepository.save(r1);
        p1.setResultado(r1);
        partidoRepository.save(p1);

        // Goals for p1
        createGol(p1, e1.getId(), 10); // Find player dynamically in real app, simplified here
        createGol(p1, e2.getId(), 45);

        // Match 2: Scheduled
        Partido p2 = Partido.builder()
                .torneo(torneo).equipoLocal(e3).equipoVisitante(e4)
                .cancha(canchas.get(1)).fecha(LocalDate.now().plusDays(1))
                .hora(LocalTime.of(20, 0)).arbitro("Pedro R.")
                .tipoPartido("JORNADA 2").estado(Partido.EstadoPartido.PROGRAMADO)
                .build();
        partidoRepository.save(p2);
    }

    private Equipo createEquipo(Torneo t, String nombre, String dt) {
        return equipoRepository.save(Equipo.builder().nombre(nombre).directorTecnico(dt).torneo(t).build());
    }

    private void createJugador(Equipo e, String nombre, int num, String pos) {
        jugadorRepository.save(Jugador.builder().nombre(nombre).numero(num).posicion(pos).equipo(e).build());
    }

    private void createGol(Partido p, Long equipoId, int min) {
        List<Jugador> jugadores = jugadorRepository.findByEquipoId(equipoId);
        if (!jugadores.isEmpty()) {
            golRepository.save(Gol.builder().partido(p).jugador(jugadores.get(0)).minuto(min).build());
        }
    }
}
