package lk.bookbarlibrary.supplier.dao;

import lk.bookbarlibrary.supplier.entity.SupplierStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierStatusDao extends JpaRepository<SupplierStatus, Integer> {
}
