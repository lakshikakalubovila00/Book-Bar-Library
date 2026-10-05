package lk.bookbarlibrary.donator.controller;

import lk.bookbarlibrary.AuthController;
import lk.bookbarlibrary.CommonController;
import lk.bookbarlibrary.donator.dao.DonatorDao;
import lk.bookbarlibrary.donator.dao.DonatorStatusDao;
import lk.bookbarlibrary.donator.entity.Donator;
import lk.bookbarlibrary.privilege.entity.Privilege;
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
public class DonatorController implements CommonController<Donator> {

    @Autowired
    private DonatorDao donatorDao;

    @Autowired
    private AuthController authController;

    @Autowired
    private UserDao userDao;

    @Autowired
    private DonatorStatusDao donatorStatusDao;

    @Override
    @RequestMapping(value="/donator")
    public ModelAndView getUi() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView donatorView = new ModelAndView();
        donatorView.addObject("loggedusername" , authentication.getName());
        donatorView.addObject("title" , "Donator Management");
        donatorView.setViewName("donator.html");
        return donatorView;
    }

    @GetMapping(value = "/donator/byid/{donatorid}", produces = "application/json")
    public Donator getDonatorById(@PathVariable Integer donatorid) {
        return donatorDao.getReferenceById(donatorid);
    }

    @Override
    @GetMapping(value = "/donator/alldata", produces = "application/json")
    public List<Donator> findAllData() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(),"Donator");
        if(userPrivi.getPrivi_select()){
            return donatorDao.findAll();
        }else {
            return new ArrayList<>();
        }
    }

    @Override
    @PostMapping(value = "/donator/insert")
    public String saveData(@RequestBody Donator donator) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(),"Donator");
        if (!userPrivi.getPrivi_insert()){
            return "Donator Save not completed : User haven't permission.";
        }
        // check duplicate email
        Donator extDonatorByEmail= donatorDao.getByEmail(donator.getEmail());
                if(extDonatorByEmail!=null){
                    return "Donator Save not completed : Given Email"+ donator.getEmail()+" Email Already exists";
                }
        // check duplicate contact no
        Donator extDonatorByContactNo= donatorDao.getByContactno(donator.getContactno());
               if(extDonatorByContactNo!=null){
                   return  "Donator Save not completed : Given Contact No"+donator.getContactno()+ " Contact No Already exists";
               }

               try{
                   // set auto generated value
                   // set added date time
                   donator.setAddeddatetime(LocalDateTime.now());
                   // set added user id
                   donator.setAddeduserid(userDao.getByUsername(authentication.getName()).getId());
                   // do operation
                   donatorDao.save(donator);

                   // check dependencies
                   return "OK";
               }catch(Exception e){
                   return "Donator insert not completed. " + e.getMessage();
               }
    }

    @Override
    @PutMapping(value = "/donator/update")
    public String updateData(@RequestBody Donator donator) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(),"Donator");
        if (!userPrivi.getPrivi_update()){
            return "Donator Update not completed : User haven't permission.";
        }

        // check existence
        if(donator.getId()==null){
            return "Donator Update not completed , Donator Not Exist..";
        }
        Donator extDonator = donatorDao.getReferenceById(donator.getId());
        if(extDonator.getId()==null){
            return "Donator Update not completed , Donator Not Exist..";
        }

        // check duplicate for unique columns

        // check duplicate email
        Donator extDonatorByEmail= donatorDao.getByEmail(donator.getEmail());
        if(extDonatorByEmail!=null && extDonatorByEmail.getId()!=extDonator.getId()){
            return "Donator Save not completed : Given Email"+ donator.getEmail()+" Email Already exists";
        }
        // check duplicate contact no
        Donator extDonatorByContactNo= donatorDao.getByContactno(donator.getContactno());
        if(extDonatorByContactNo!=null && extDonatorByContactNo.getId()!=extDonator.getId()){
            return  "Donator Save not completed : Given Contact No"+donator.getContactno()+ " Contact No Already exists";
        }
        try{
            donator.setUpdateddatetime(LocalDateTime.now());
            // set Logged user id
            donator.setUpdateduserid(userDao.getByUsername(authentication.getName()).getId());

            // do operation
            donatorDao.save(donator);

            // check dependencies
            return "OK";
        }catch(Exception e){
            return "Donator update not completed. " + e.getMessage();
        }

    }

    @Override
    @DeleteMapping(value = "/donator/delete")
    public String deleteData(@RequestBody Donator donator) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(),"Donator");
        if (!userPrivi.getPrivi_delete()){
            return "Donator Delete not completed : User haven't permission.";
        }
        // check existence
        if(donator.getId()==null){
            return "Donator Delete not completed , Donator Not Exist..";
        }
        Donator extDonator = donatorDao.getReferenceById(donator.getId());
        if(extDonator.getId()==null){
            return "Donator Delete not completed , Donator Not Exist..";
        }
        try{
            extDonator.setAddeddatetime(LocalDateTime.now());
            extDonator.setAddeduserid(userDao.getByUsername(authentication.getName()).getId());
            extDonator.setDonatorstatus_id(donatorStatusDao.getReferenceById(3));
            donatorDao.save(extDonator);
            return "OK";
        }catch(Exception e){
            return "Donator delete not completed. " + e.getMessage();
        }

    }
}
