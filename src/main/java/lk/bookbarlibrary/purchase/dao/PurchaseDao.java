package lk.bookbarlibrary.purchase.dao;

import lk.bookbarlibrary.purchase.entity.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PurchaseDao extends JpaRepository<Purchase, Integer> {

    @Query(value = "SELECT coalesce(concat(year(current_date()),lpad(substring(max(p.purchaseordercode),5)+1,6,'0')),concat(year(current_date()),'000001')) FROM Purchase p where year(current_date())=year(p.addeddatetime);", nativeQuery = true)
    String getNextCodeNo();

    @Query(value = "select p from Purchase p where  p.supplier_id.id=?1 and p.purchasestatus_id.id=1")
    List<Purchase> getPurchaseListBySupplier(Integer supplierid);
}
