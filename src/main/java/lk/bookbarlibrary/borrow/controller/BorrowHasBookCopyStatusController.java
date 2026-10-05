package lk.bookbarlibrary.borrow.controller;

import lk.bookbarlibrary.borrow.dao.BorrowHasBookCopyStatusDao;
import lk.bookbarlibrary.borrow.entity.BorrowHasBookCopyStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class BorrowHasBookCopyStatusController {

    @Autowired
    private BorrowHasBookCopyStatusDao borrowStatusDao;

    @GetMapping(value = "/borrowhasbookcopystatus/alldata", produces = "application/json")
    public List<BorrowHasBookCopyStatus> getAllBorrowStatus(){
        return borrowStatusDao.findAll();
    }
}
