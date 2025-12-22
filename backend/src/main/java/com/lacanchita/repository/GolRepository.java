package com.lacanchita.repository;

import com.lacanchita.entity.Gol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GolRepository extends JpaRepository<Gol, Long> {

    @Query("SELECT g FROM Gol g JOIN g.partido p WHERE p.torneo.id = :torneoId")
    List<Gol> findByTorneoId(@Param("torneoId") Long torneoId);

    void deleteByPartidoId(Long partidoId);
}
