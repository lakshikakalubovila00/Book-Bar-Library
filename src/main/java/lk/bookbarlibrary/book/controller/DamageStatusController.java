package lk.bookbarlibrary.book.controller;

import lk.bookbarlibrary.book.dao.DamageStatusDao;
import lk.bookbarlibrary.book.entity.DamageStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class DamageStatusController {
    @Autowired
    private DamageStatusDao damageStatusDao;

    @GetMapping(value = "/damagestatus/alldata", produces = "application/json")
    public List<DamageStatus> getAllDamageStatus() {
        return damageStatusDao.findAll();
    }
}
