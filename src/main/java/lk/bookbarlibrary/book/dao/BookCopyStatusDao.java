package lk.bookbarlibrary.book.dao;

import lk.bookbarlibrary.book.entity.BookCopyStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookCopyStatusDao extends JpaRepository<BookCopyStatus, Integer> {

}
