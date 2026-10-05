package lk.bookbarlibrary.book.controller;


import lk.bookbarlibrary.book.dao.NewsPaperEditionDao;
import lk.bookbarlibrary.book.entity.NewsPaperEdition;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class NewsPaperEditionController {
    @Autowired
    private NewsPaperEditionDao newsPaperEditionDao;

    @GetMapping(value = "/newspaperedition/alldata" , produces = "application/json")
    public List<NewsPaperEdition> getAllNewsPaperEdition() {
        return newsPaperEditionDao.findAll();
    }
}
