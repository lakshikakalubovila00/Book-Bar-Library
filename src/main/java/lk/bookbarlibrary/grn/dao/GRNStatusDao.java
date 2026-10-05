package lk.bookbarlibrary.grn.dao;

import lk.bookbarlibrary.grn.entity.GRNStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GRNStatusDao  extends JpaRepository<GRNStatus,Integer> {
}
