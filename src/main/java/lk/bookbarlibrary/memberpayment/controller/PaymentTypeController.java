package lk.bookbarlibrary.memberpayment.controller;

import lk.bookbarlibrary.memberpayment.dao.PaymentTypeDao;
import lk.bookbarlibrary.memberpayment.entity.PaymentType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class PaymentTypeController {
    @Autowired
    private PaymentTypeDao paymentTypeDao;

    @GetMapping(value = "/paymenttype/alldata", produces = "application/json")
    public List<PaymentType> getAllPaymentType() {
        return paymentTypeDao.findAll();
    }

}
