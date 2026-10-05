package lk.bookbarlibrary.book.dao;

import lk.bookbarlibrary.book.entity.Language;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LanguageDao extends JpaRepository<Language, Integer> {

}
