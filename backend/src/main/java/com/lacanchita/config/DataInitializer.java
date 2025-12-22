package com.lacanchita.config;

import com.lacanchita.entity.Noticia;
import com.lacanchita.repository.NoticiaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

        private final NoticiaRepository noticiaRepository;

        @Override
        public void run(String... args) throws Exception {
                if (noticiaRepository.count() == 0) {
                        System.out.println("No news found. Seeding initial data...");

                        Noticia n1 = Noticia.builder()
                                        .titulo("¡Inscripciones Abiertas para el Torneo de Verano!")
                                        .contenido(
                                                        "Ya están abiertas las inscripciones para nuestro próximo torneo. Arma tu equipo y compite por grandes premios. Fecha límite: 30 de Agosto.")
                                        .fechaPublicacion(LocalDateTime.now().minusDays(2))
                                        .imagenUrl("images/passion.png")
                                        .build();

                        Noticia n2 = Noticia.builder()
                                        .titulo("Mantenimiento de Canchas")
                                        .contenido(
                                                        "Informamos que la Cancha 2 estará cerrada por mantenimiento este fin de semana para asegurar la mejor calidad de césped para ustedes.")
                                        .fechaPublicacion(LocalDateTime.now().minusDays(5))
                                        .imagenUrl(null)
                                        .build();

                        Noticia n3 = Noticia.builder()
                                        .titulo("Gran Final: Los Rayos vs. Halcones")
                                        .contenido(
                                                        "No te pierdas este sábado la gran final de la Liga Premier. Habrá música, comida y un ambiente familiar increíble. ¡Te esperamos!")
                                        .fechaPublicacion(LocalDateTime.now().minusHours(10))
                                        .imagenUrl("images/goal.png")
                                        .build();

                        noticiaRepository.save(n1);
                        noticiaRepository.save(n2);
                        noticiaRepository.save(n3);

                        System.out.println("Data seeding completed.");
                }
        }
}
