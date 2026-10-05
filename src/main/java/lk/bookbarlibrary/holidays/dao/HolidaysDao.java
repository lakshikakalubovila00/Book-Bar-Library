package lk.bookbarlibrary.holidays.dao;

import lk.bookbarlibrary.holidays.entity.Holidays;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HolidaysDao extends JpaRepository<Holidays, Integer> {
}
