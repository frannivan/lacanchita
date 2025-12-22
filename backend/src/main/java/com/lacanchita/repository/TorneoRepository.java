package com.lacanchita.repository;

import com.lacanchita.entity.Torneo;
import com.lacanchita.entity.Torneo.EstadoTorneo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TorneoRepository extends JpaRepository<Torneo, Long> {
    List<Torneo> findByEstado(EstadoTorneo estado);

    List<Torneo> findByCategoria(String categoria);
}
