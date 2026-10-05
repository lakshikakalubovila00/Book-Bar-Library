package lk.bookbarlibrary.borrow.dao;

import lk.bookbarlibrary.borrow.entity.BorrowHasBookCopyStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BorrowHasBookCopyStatusDao extends JpaRepository<BorrowHasBookCopyStatus, Integer> {
}
