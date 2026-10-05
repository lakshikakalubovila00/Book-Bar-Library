package lk.bookbarlibrary.supplier.dao;

import jakarta.validation.constraints.NotNull;
import lk.bookbarlibrary.supplier.entity.Supplier;
import org.hibernate.validator.constraints.Length;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SupplierDao extends JpaRepository<Supplier, Integer> {

    @Query(value = "select s from Supplier s where s.email=?1")
    Supplier getByEmail(@NotNull String email);

    @Query(value = "select s from Supplier s where s.contactno=?1")
    Supplier getByContactno( String contactno);

    @Query(value = "select s from Supplier s where s.accountno=?1")
    Supplier getByAccountno(String accountno);

    @Query(value = "select s from Supplier s where s.businessregistrationno=?1")
    Supplier getByBusinessregistrationno(@NotNull String businessregistrationno);

    @Query(value = "select distinct shb.supplier_id from SupplierHasBook shb where shb.book_id.title=?1")
    List<Supplier> getSuppliersByBook(String booktitle);
}
