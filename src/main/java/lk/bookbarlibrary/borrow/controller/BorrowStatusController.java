package lk.bookbarlibrary.borrow.controller;

import lk.bookbarlibrary.borrow.dao.BorrowStatusDao;
import lk.bookbarlibrary.borrow.entity.BorrowStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class BorrowStatusController {
    @Autowired
    private BorrowStatusDao borrowStatusDao;

    @GetMapping(value = "/borrowstatus/alldata", produces = "application/json")
    public List<BorrowStatus> getAllBorrowStatus(){
        return borrowStatusDao.findAll();
    }
}
