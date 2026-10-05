package lk.bookbarlibrary.shelflocation.controller;

import lk.bookbarlibrary.shelflocation.dao.BuildingDao;
import lk.bookbarlibrary.shelflocation.entity.Building;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class BuildingController {
    @Autowired
    private BuildingDao buildingDao;

    @GetMapping(value = "/building/alldata", produces = "application/json")
    public List<Building> getAllBuildings(){
        return buildingDao.findAll();
    }
}
