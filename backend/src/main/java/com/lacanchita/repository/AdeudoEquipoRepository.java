package com.lacanchita.repository;

import com.lacanchita.entity.AdeudoEquipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AdeudoEquipoRepository extends JpaRepository<AdeudoEquipo, Long> {
    List<AdeudoEquipo> findByEquipoId(Long equipoId);
}
