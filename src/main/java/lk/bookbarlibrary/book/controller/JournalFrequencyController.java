package lk.bookbarlibrary.book.controller;

import lk.bookbarlibrary.book.dao.JournalFrequencyDao;
import lk.bookbarlibrary.book.entity.JournalFrequency;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class JournalFrequencyController {
    @Autowired
    private JournalFrequencyDao journalfrequencyDao;

    @GetMapping(value = "/journalfrequency/alldata", produces = "application/json")
    public List<JournalFrequency> getAllJournalFrequency() {
        return journalfrequencyDao.findAll();
    }
}
