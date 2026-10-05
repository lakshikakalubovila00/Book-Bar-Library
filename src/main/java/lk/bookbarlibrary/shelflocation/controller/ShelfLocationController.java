package lk.bookbarlibrary.shelflocation.controller;

import lk.bookbarlibrary.AuthController;
import lk.bookbarlibrary.privilege.entity.Privilege;
import lk.bookbarlibrary.shelflocation.dao.ShelfLocationDao;
import lk.bookbarlibrary.shelflocation.entity.ShelfLocation;
import lk.bookbarlibrary.shelflocation.entity.ShelfLocationItem;
import lk.bookbarlibrary.user.dao.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
public class ShelfLocationController  {

    @Autowired
    private AuthController authController;

    @Autowired
    private UserDao userDao;

    @Autowired
    private ShelfLocationDao shelfLocationDao;


    @RequestMapping(value = "/shelflocation")
    public ModelAndView getUi() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView guaranteeView = new ModelAndView();
        guaranteeView.addObject("loggedusername" , authentication.getName());
        guaranteeView.addObject("title", "Shelf Location Management");
        guaranteeView.setViewName("shelflocation.html");
        return guaranteeView;
    }


    @GetMapping(value = "/shelflocation/alldata")
    public List<ShelfLocation> findAllData() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(),"Shelf-Location");
        if(userPrivi.getPrivi_select()){
            return shelfLocationDao.findAll();
        }else{
            return new ArrayList<>();
        }
    }

    @GetMapping(value = "/shelflocation/byid/{id}" ,produces = "application/json")
    public ShelfLocation getShelfLocationById(@PathVariable Integer id){
        return  shelfLocationDao.getReferenceById(id);
    }


    @PostMapping("/shelflocation/save")
    public String saveData(@RequestBody ShelfLocation  shelfLocation) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(),"Shelf-Location");
       if(!userPrivi.getPrivi_insert()){
           return "Shelf Locations Saving not completed : User haven't permission";
       }
       try{

               shelfLocation.setAddeddatetime(LocalDateTime.now());
               shelfLocation.setAddeduserid(userDao.getByUsername(authentication.getName()).getId());
               for(ShelfLocationItem sli : shelfLocation.getShelfLocationList()){
                   sli.setShelflocation_id(shelfLocation);
               }
               shelfLocationDao.save(shelfLocation);

           return "OK";
       }catch(Exception e){
           return "Shelf Locations saving not completed."+e.getMessage();
       }
    }

    @PutMapping("/shelflocation/update")
    public String updateData(@RequestBody ShelfLocation shelfLocation) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(),"Shelf-Location");
        if(!userPrivi.getPrivi_update()){
            return "Shelf Location Update not completed : User haven't permission";
        }
        // check existence
        if(shelfLocation.getId()==null){
            return "Shelf Location Update not completed : Shelf Location not exist";
        }
        ShelfLocation extShelfLocation = shelfLocationDao.getReferenceById(shelfLocation.getId());
        if(extShelfLocation.getId()==null){
            return "Shelf Location Update not completed : Shelf Location not exist";
        }
        try{
            shelfLocation.setUpdateddatetime(LocalDateTime.now());
            shelfLocation.setUpdateduserid(userDao.getByUsername(authentication.getName()).getId());
            for(ShelfLocationItem sli : shelfLocation.getShelfLocationList()){
                sli.setShelflocation_id(shelfLocation);
            }
            shelfLocationDao.save(shelfLocation);
            return "OK";
        }catch(Exception e){
            return "Shelf Location Update not completed."+e.getMessage();
        }
    }

    @DeleteMapping(value="/shelflocation/delete")
    public String deleteData(@RequestBody  ShelfLocation shelfLocation) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(),"Shelf-Location");
        if(!userPrivi.getPrivi_delete()){
            return "Shelf Location Delete not completed : User haven't permission";
        }
        // check existence
        if(shelfLocation.getId()==null){
            return "Shelf Location Delete not completed : Shelf Location not exist";
        }
        ShelfLocation extShelfLocation = shelfLocationDao.getReferenceById(shelfLocation.getId());
        if(extShelfLocation.getId()==null){
            return "Shelf Location Delete not completed : Shelf Location not exist";
        }
        try{
            extShelfLocation.setDeleteddatetime(LocalDateTime.now());
            extShelfLocation.setDeleteduserid(userDao.getByUsername(authentication.getName()).getId());
            // status
            shelfLocationDao.delete(extShelfLocation);
            return "OK";
        }catch(Exception e){
            return "Shelf Location Delete not completed."+e.getMessage();
        }

    }
}
