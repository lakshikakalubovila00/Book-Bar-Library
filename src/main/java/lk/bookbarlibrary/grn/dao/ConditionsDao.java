package lk.bookbarlibrary.grn.dao;

import lk.bookbarlibrary.grn.entity.Conditions;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConditionsDao extends JpaRepository<Conditions,Integer> {
}
