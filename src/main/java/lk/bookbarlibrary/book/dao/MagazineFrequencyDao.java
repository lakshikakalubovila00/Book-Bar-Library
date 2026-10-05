package lk.bookbarlibrary.book.dao;

import lk.bookbarlibrary.book.entity.MagazineFrequency;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MagazineFrequencyDao extends JpaRepository<MagazineFrequency, Integer> {
}
