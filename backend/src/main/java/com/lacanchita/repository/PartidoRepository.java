package com.lacanchita.repository;

import com.lacanchita.entity.Partido;
import com.lacanchita.entity.Partido.EstadoPartido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PartidoRepository extends JpaRepository<Partido, Long> {
    List<Partido> findByTorneoIdAndEstado(Long torneoId, EstadoPartido estado);

    List<Partido> findByFecha(LocalDate fecha);

    List<Partido> findByTorneoIdAndFechaBeforeOrderByFechaDesc(Long torneoId, LocalDate fecha);

    List<Partido> findByTorneoIdAndFechaAfterOrderByFechaAsc(Long torneoId, LocalDate fecha);

    List<Partido> findByTorneoIdAndEstadoOrderByFechaDesc(Long torneoId, EstadoPartido estado);

    List<Partido> findByTorneoId(Long torneoId);
}
