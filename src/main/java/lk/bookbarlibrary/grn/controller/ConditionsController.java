package lk.bookbarlibrary.grn.controller;

import lk.bookbarlibrary.grn.dao.ConditionsDao;
import lk.bookbarlibrary.grn.entity.Conditions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ConditionsController {
    @Autowired
    private ConditionsDao conditionsDao;

    @GetMapping(value = "/conditions/alldata", produces = "application/json")
    public List<Conditions> getAllCondition(){
        return conditionsDao.findAll();
    }
}
