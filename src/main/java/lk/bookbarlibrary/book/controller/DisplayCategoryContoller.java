package lk.bookbarlibrary.book.controller;

import lk.bookbarlibrary.book.dao.BookStatusDao;
import lk.bookbarlibrary.book.dao.DisplayCategoryDao;
import lk.bookbarlibrary.book.entity.DisplayCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class DisplayCategoryContoller {
    @Autowired
    private DisplayCategoryDao displayCategoryDao;

    @GetMapping(value = "/displaycategory/alldata", produces = "application/json")
    public List<DisplayCategory> getAllDisplayCategory()
    {
        return displayCategoryDao.findAll();
    }
}
