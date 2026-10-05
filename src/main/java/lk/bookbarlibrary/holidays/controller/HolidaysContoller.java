package lk.bookbarlibrary.holidays.controller;

import lk.bookbarlibrary.AuthController;
import lk.bookbarlibrary.employee.entity.Employee;
import lk.bookbarlibrary.holidays.dao.HolidaysDao;
import lk.bookbarlibrary.holidays.entity.Holidays;
import lk.bookbarlibrary.privilege.entity.Privilege;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class HolidaysContoller {

    @Autowired
    private HolidaysDao holidaysDao;

    @Autowired
    private AuthController  authController;

    @RequestMapping(value = "/libraryholidays")
    public ModelAndView libraryHolidaysUi(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView libraryHolidaysView = new ModelAndView();
        libraryHolidaysView.addObject("loggedusername" , authentication.getName());
        libraryHolidaysView.addObject("title", "Library Holidays Management");
        libraryHolidaysView.setViewName("holidays.html");
        return libraryHolidaysView;
    }

    @GetMapping(value = "/holidays/alldata")
    public List<Holidays> getHolidaysList(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(),"Library-Holidays");
        if(userPrivi.getPrivi_select()){
            return holidaysDao.findAll();
        }else{
            return new ArrayList<>();
        }

    }

    @GetMapping(value = "/calendar")
    public List<Map<String, Object>> getCalendar(){
        List<Holidays> holidays = holidaysDao.findAll();
        // Map stores data as key-value pairs
        // Create empty list
        List<Map<String, Object>> events = new ArrayList<>();
        // loop through holidays
        for (Holidays holiday : holidays) {
            // Creates an empty Map
            Map<String, Object> event = new HashMap<>();
            event.put("title", holiday.getTitle());
            event.put("date", holiday.getDate());
            event.put("day", holiday.getDay());
            // add to list
            events.add(event);
        }
        return events;
    }

    @RequestMapping(value="/calendarview")
    public ModelAndView getUi() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView calendarView = new ModelAndView();
        calendarView.addObject("loggedusername", authentication.getName());
        calendarView.addObject("title", "Calendar");
        calendarView.setViewName("calendar.html");
        return calendarView;
    }

    @PostMapping(value = "/holidays/insertall")
    public String insertAll(@RequestBody List<Holidays> holidays){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(),"Library-Holidays");
        if(!userPrivi.getPrivi_insert()){
            return "Library Holidays Save not completed : User haven't permission.";
        }
        // check duplicate for unique columns
        // try operation
        try {
            // do operation
            holidaysDao.saveAll(holidays);

            // check dependencies

            return "OK";
        }catch (Exception e){
            return "Library Holidays save not completed."+e.getMessage();
        }
    }
}
