package lk.bookbarlibrary.book.dao;

import lk.bookbarlibrary.book.entity.DamageStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DamageStatusDao extends JpaRepository<DamageStatus, Integer> {
}
