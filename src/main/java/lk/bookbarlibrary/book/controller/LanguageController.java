package lk.bookbarlibrary.book.controller;

import lk.bookbarlibrary.book.dao.LanguageDao;
import lk.bookbarlibrary.book.entity.Language;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class LanguageController {
 @Autowired
    private LanguageDao languageDao;

 @GetMapping(value = "/language/alldata", produces = "application/json")
    public List<Language> getAllLanguage()
    {
        return languageDao.findAll();
    }
}
