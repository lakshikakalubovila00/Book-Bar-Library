package lk.bookbarlibrary.memberpayment.dao;

import lk.bookbarlibrary.memberpayment.entity.MemberPaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberPaymentMethodDao extends JpaRepository<MemberPaymentMethod, Integer> {

}
