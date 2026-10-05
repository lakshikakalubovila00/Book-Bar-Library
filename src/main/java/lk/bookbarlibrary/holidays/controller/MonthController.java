package lk.bookbarlibrary.holidays.controller;

import lk.bookbarlibrary.holidays.dao.MonthDao;
import lk.bookbarlibrary.holidays.entity.Month;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MonthController {
    @Autowired
    private MonthDao monthDao;

    @GetMapping(value = "/month/alldata" , produces = "application/json")
    private List<Month> findAll() {
       return monthDao.findAll();
    }
}
