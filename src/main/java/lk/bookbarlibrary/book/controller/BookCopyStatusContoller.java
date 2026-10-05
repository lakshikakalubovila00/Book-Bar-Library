package lk.bookbarlibrary.book.controller;

import lk.bookbarlibrary.book.dao.BookCopyStatusDao;
import lk.bookbarlibrary.book.entity.BookCopyStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class BookCopyStatusContoller {
    @Autowired
    private BookCopyStatusDao bookCopyStatusDao;

    @GetMapping(value = "/bookcopystatus/alldata", produces = "application/json")
    public List<BookCopyStatus> getAllBookCopyStatus() {
        return bookCopyStatusDao.findAll();
    }
}
