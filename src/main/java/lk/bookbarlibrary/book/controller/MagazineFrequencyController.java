package lk.bookbarlibrary.book.controller;

import lk.bookbarlibrary.book.dao.MagazineFrequencyDao;
import lk.bookbarlibrary.book.entity.MagazineFrequency;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MagazineFrequencyController {
    @Autowired
    private MagazineFrequencyDao magazineFrequencyDao;

    @GetMapping(value = "/magazinefrequency/alldata", produces = "application/json")
    public List<MagazineFrequency> getFrequency(){
        return magazineFrequencyDao.findAll();
    }

}
