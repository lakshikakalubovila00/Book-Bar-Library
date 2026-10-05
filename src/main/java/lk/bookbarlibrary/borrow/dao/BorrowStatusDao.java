package lk.bookbarlibrary.borrow.dao;

import lk.bookbarlibrary.borrow.entity.BorrowStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BorrowStatusDao extends JpaRepository<BorrowStatus, Integer> {
}
