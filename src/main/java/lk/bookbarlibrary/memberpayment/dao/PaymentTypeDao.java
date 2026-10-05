package lk.bookbarlibrary.memberpayment.dao;

import lk.bookbarlibrary.memberpayment.entity.PaymentType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentTypeDao extends JpaRepository<PaymentType, Integer> {

}
