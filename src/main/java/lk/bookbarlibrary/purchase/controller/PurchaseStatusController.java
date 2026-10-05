package lk.bookbarlibrary.purchase.controller;

import lk.bookbarlibrary.purchase.dao.PurchaseStatusDao;
import lk.bookbarlibrary.purchase.entity.PurchaseStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class PurchaseStatusController {
    @Autowired
    private PurchaseStatusDao purchaseStatusDao;

    @GetMapping(value = "/purchasestatus/alldata", produces = "application/json")
    public List<PurchaseStatus> getAllPurchaseStatus() {
        return purchaseStatusDao.findAll();
    }
}
