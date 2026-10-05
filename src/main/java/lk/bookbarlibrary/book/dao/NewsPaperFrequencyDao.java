package lk.bookbarlibrary.book.dao;

import lk.bookbarlibrary.book.entity.NewsPaperFrequency;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsPaperFrequencyDao extends JpaRepository<NewsPaperFrequency, Integer> {
}
