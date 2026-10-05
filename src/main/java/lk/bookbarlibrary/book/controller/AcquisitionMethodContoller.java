package lk.bookbarlibrary.book.controller;

import lk.bookbarlibrary.book.dao.AcquisitionMethodDao;
import lk.bookbarlibrary.book.entity.AcquisitionMethod;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class AcquisitionMethodContoller {
    @Autowired
    private AcquisitionMethodDao acquisitionMethodDao;

    @GetMapping(value = "/acquisitionmethod/alldata", produces = "application/json")
    public List<AcquisitionMethod> getAllAcquisitionMethod() {
        return acquisitionMethodDao.findAll();
    }
}
