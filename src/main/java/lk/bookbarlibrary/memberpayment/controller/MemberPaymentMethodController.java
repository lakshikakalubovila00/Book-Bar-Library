package lk.bookbarlibrary.memberpayment.controller;

import lk.bookbarlibrary.memberpayment.dao.MemberPaymentMethodDao;
import lk.bookbarlibrary.memberpayment.entity.MemberPaymentMethod;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MemberPaymentMethodController {

    @Autowired
    private MemberPaymentMethodDao memberPaymentMethodDao;

    @GetMapping(value = "/memberpaymentmethod/alldata", produces = "application/json")
    public List<MemberPaymentMethod> getAllMemberPaymentMethod() {
        return memberPaymentMethodDao.findAll();
    }

}
