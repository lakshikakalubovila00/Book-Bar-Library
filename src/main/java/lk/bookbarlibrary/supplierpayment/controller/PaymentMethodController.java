package lk.bookbarlibrary.supplierpayment.controller;

import lk.bookbarlibrary.supplierpayment.dao.PaymentMethodDao;
import lk.bookbarlibrary.supplierpayment.entity.PaymentMethod;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class PaymentMethodController {
    @Autowired
    private PaymentMethodDao paymentMethodDao;

    @GetMapping(value = "/paymentmethod/alldata", produces = "application/json")
    public List<PaymentMethod> getAllPaymentMethod(){
        return paymentMethodDao.findAll();
    }
}
