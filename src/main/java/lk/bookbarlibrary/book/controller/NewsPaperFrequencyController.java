package lk.bookbarlibrary.book.controller;

import lk.bookbarlibrary.book.dao.NewsPaperFrequencyDao;
import lk.bookbarlibrary.book.entity.NewsPaperFrequency;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class NewsPaperFrequencyController {
    @Autowired
    private NewsPaperFrequencyDao newsPaperFrequencyDao;

    @GetMapping(value = "/newspaerfrequency/alldata", produces = "application/json")
    public List<NewsPaperFrequency> getAllNewsPaperFrequency() {
        return newsPaperFrequencyDao.findAll();
    }
}
