package lk.bookbarlibrary.employee.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.bookbarlibrary.employee.dao.EmployeeStatusDao;
import lk.bookbarlibrary.employee.entity.EmployeeStatus;

@RestController
public class EmployeeStatusController {
     @Autowired
    private EmployeeStatusDao employeeStatusDao;

    @GetMapping(value="/employeestatus/alldata",produces="application/json")
    public List<EmployeeStatus> getAllEmployeeStatusData(){
        return employeeStatusDao.findAll();
    }
}
