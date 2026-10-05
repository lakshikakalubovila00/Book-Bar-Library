package lk.bookbarlibrary.supplierpayment.dao;

import lk.bookbarlibrary.supplierpayment.entity.SupplierPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SupplierPaymentDao extends JpaRepository<SupplierPayment,Integer> {

    @Query(value = "SELECT coalesce(concat('PAY',year(current_date()),lpad(substring(max(sp.paymentno),8)+1,5,'0')), concat('PAY',year(current_date()),'00001')) From SupplierPayment sp where year(current_date())=year(sp.addeddatetime)", nativeQuery = true)
    String getNextPaymentNo();
}
