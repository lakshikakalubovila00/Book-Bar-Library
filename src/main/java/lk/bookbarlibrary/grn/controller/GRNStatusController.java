package lk.bookbarlibrary.grn.controller;

import lk.bookbarlibrary.grn.dao.GRNStatusDao;
import lk.bookbarlibrary.grn.entity.GRNStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class GRNStatusController {
    @Autowired
    private GRNStatusDao grnStatusDao;

    @GetMapping(value = "/grnstatus/alldata", produces = "application/json")
    public List<GRNStatus> getAllGRNStatus(){
        return grnStatusDao.findAll();
    }
}
