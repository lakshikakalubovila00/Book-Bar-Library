package lk.bookbarlibrary.memberpayment.dao;

import lk.bookbarlibrary.memberpayment.entity.PaymentHasBorrow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;

public interface PaymentHasBorrowDao extends JpaRepository<PaymentHasBorrow,Integer> {

    // coalesce - ensures that if no payment records exist, the query returns 0 instead of NULL
    @Query(value = "select coalesce(sum (phb.paidamount),0)from PaymentHasBorrow phb where  phb.borrow_id.id=:borrowId")
    BigDecimal getTotalPaidByBorrow(Integer borrowId);
}
