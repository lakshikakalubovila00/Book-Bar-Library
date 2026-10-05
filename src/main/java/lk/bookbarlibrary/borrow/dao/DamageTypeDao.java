package lk.bookbarlibrary.borrow.dao;

import lk.bookbarlibrary.borrow.entity.DamageType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DamageTypeDao extends JpaRepository< DamageType, Integer> {
}
