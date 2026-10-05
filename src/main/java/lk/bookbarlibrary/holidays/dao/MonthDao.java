package lk.bookbarlibrary.holidays.dao;

import lk.bookbarlibrary.holidays.entity.Month;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MonthDao extends JpaRepository<Month,Integer> {
}
