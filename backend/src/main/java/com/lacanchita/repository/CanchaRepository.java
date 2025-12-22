package com.lacanchita.repository;

import com.lacanchita.entity.Cancha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CanchaRepository extends JpaRepository<Cancha, Long> {
    List<Cancha> findByActiva(boolean activa);
}
