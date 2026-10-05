package lk.bookbarlibrary.guarantor.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.bookbarlibrary.guarantor.dao.GuarantorStatusDao;
import lk.bookbarlibrary.guarantor.entity.GuarantorStatus;

@RestController
public class GuarantorStatusController {
    @Autowired
    private GuarantorStatusDao guarantorStatusDao;

    @GetMapping(value="/guarantorstatus/alldata", produces = "application/json")
    public List<GuarantorStatus> getAllGuarantorStatusData(){
        return guarantorStatusDao.findAll();
    }
}