package lk.bookbarlibrary.supplier.controller;

import lk.bookbarlibrary.supplier.dao.SupplierStatusDao;
import lk.bookbarlibrary.supplier.entity.SupplierStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SupplierStatusController {
    @Autowired
    private SupplierStatusDao supplierStatusDao;

    @GetMapping(value = "/supplierstatus/alldata", produces = "application/json")
    public List<SupplierStatus> getAllSupplierStatus(){
        return supplierStatusDao.findAll();
    }
}
