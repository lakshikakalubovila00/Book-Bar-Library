package lk.bookbarlibrary.shelflocation.controller;

import lk.bookbarlibrary.shelflocation.dao.RackDao;
import lk.bookbarlibrary.shelflocation.entity.Rack;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class RackController {
    @Autowired
    private RackDao rackDao;

    @GetMapping(value = "/rack/alldata", produces = "application/json")
    public List<Rack> getAllRacks(){
        return rackDao.findAll();
    }

    @GetMapping(value = "/rack/byfloor/{floorid}", produces = "application/json")
    public List<Rack> getRackByFloor(@PathVariable Integer floorid){
        return rackDao.getRackByFloorId(floorid);
    }
}
