package lk.bookbarlibrary.borrow.controller;

import lk.bookbarlibrary.borrow.dao.DamageTypeDao;
import lk.bookbarlibrary.borrow.entity.DamageType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class DamageTypeController {
    @Autowired
    private DamageTypeDao damageTypeDao;

    @GetMapping(value = "/damagetype/alldata", produces = "application/json")
    public List<DamageType> getAllDamageType() {
        return damageTypeDao.findAll();
    }
}
