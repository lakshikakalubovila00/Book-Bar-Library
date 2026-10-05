package lk.bookbarlibrary.book.controller;

import lk.bookbarlibrary.book.dao.BookStatusDao;
import lk.bookbarlibrary.book.entity.BookStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class BookStatusContoller {
    @Autowired
    private BookStatusDao bookStatusDao;

    @GetMapping(value = "/bookstatus/alldata", produces = "application/json")
    public List<BookStatus> getAllBookStatus()
    {
        return bookStatusDao.findAll();
    }
}
