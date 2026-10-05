package lk.bookbarlibrary.book.dao;

import lk.bookbarlibrary.book.entity.BookStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookStatusDao extends JpaRepository<BookStatus, Integer> {

}
