package lk.bookbarlibrary.supplierpayment.dao;

import lk.bookbarlibrary.supplierpayment.entity.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentMethodDao extends JpaRepository<PaymentMethod,Integer> {
}
