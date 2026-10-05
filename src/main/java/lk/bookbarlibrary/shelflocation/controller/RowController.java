package lk.bookbarlibrary.shelflocation.controller;

import lk.bookbarlibrary.shelflocation.dao.RowDao;
import lk.bookbarlibrary.shelflocation.entity.Row;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class RowController {
    @Autowired
    private RowDao rowDao;

    @GetMapping(value = "/row/alldata", produces = "application/json")
    public List<Row> getAllRows(){
        return rowDao.findAll();
    }

    @GetMapping(value = "/row/byrack/{rackid}", produces = "application/json")
    public List<Row> getRowsByRack(@PathVariable Integer rackid){
        return rowDao.getRowByRackId(rackid);
    }
}
