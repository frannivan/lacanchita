package com.lacanchita.repository;

import com.lacanchita.entity.PagoEquipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PagoEquipoRepository extends JpaRepository<PagoEquipo, Long> {
    List<PagoEquipo> findByEquipoId(Long equipoId);
}
