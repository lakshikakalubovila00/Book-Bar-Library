package lk.bookbarlibrary.shelflocation.controller;

import lk.bookbarlibrary.shelflocation.dao.FloorDao;
import lk.bookbarlibrary.shelflocation.entity.Floor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class FloorController {
    @Autowired
    private FloorDao floorDao;

    @GetMapping(value = "/floor/alldata" , produces = "application/json")
    public List<Floor> getAllFloors(){
        return floorDao.findAll();
    }

    @GetMapping(value = "/floor/bybuilding/{buildingid}", produces = "application/json")
    public List<Floor> getFloorByBuilding(@PathVariable Integer buildingid){
        return floorDao.getFloorByBuildingId(buildingid);
    }
}
