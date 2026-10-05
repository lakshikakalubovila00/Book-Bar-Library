package lk.bookbarlibrary.employee.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import lk.bookbarlibrary.employee.dao.DesignationDao;
import lk.bookbarlibrary.employee.entity.Designation;

@RestController
public class DesignationController {
     @Autowired
    private DesignationDao designationDao;

    @GetMapping(value="/designation/alldata",produces="application/json")
    public List<Designation> getAllDesignationData(){
        return designationDao.findAll();
    }
    
    @PostMapping(value = "/designation/insert")
    public String saveDesignation(@RequestBody Designation designation){
        try{
            designationDao.save(designation);
            return "OK";
        }catch (Exception e){
            return "Designation save not completed."+e.getMessage();
        }
    }
}
