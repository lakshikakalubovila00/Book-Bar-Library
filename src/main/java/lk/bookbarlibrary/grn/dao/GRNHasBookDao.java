package lk.bookbarlibrary.grn.dao;

import lk.bookbarlibrary.grn.entity.GRNHasBook;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GRNHasBookDao extends JpaRepository<GRNHasBook,Integer> {
}
