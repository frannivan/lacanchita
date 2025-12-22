package com.lacanchita.repository;

import com.lacanchita.entity.Noticia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticiaRepository extends JpaRepository<Noticia, Long> {
    // Basic CRUD is provided by JpaRepository
    // We might want to find by date later, but for now findAll(Sort) is enough
}
