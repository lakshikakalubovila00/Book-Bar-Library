package lk.bookbarlibrary.memberpayment.dao;

import lk.bookbarlibrary.memberpayment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PaymentDao extends JpaRepository<Payment, Integer> {

    @Query(value = "select p from Payment p where p.membership_id=?1")
    Payment getByMembership_id(String membershipid);

    @Query(value = "select p from Payment p where p.referenceno=?1")
    Payment getByReferenceno(String referenceno);

    @Query(value = "SELECT coalesce(concat('PAY',year(current_date()),lpad(substring(max(p.paymentno),8)+1,5,'0')), concat('PAY',year(current_date()),'00001')) From Payment p where year(current_date())=year(p.addeddatetime)", nativeQuery = true)
    String getNextPaymentNo();


}
