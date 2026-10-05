package lk.bookbarlibrary.purchase.dao;

import lk.bookbarlibrary.purchase.entity.PurchaseStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseStatusDao extends JpaRepository<PurchaseStatus, Integer> {
}
