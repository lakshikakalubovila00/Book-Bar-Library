package lk.bookbarlibrary.privilege.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lk.bookbarlibrary.AuthController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.bookbarlibrary.CommonController;
import lk.bookbarlibrary.privilege.dao.PrivilegeDao;
import lk.bookbarlibrary.privilege.entity.Privilege;

@RestController
public class PrivilegeController implements CommonController<Privilege> {

    @Autowired
    private PrivilegeDao privilegeDao;

    @Autowired
    private AuthController authController;


    @Override
    @GetMapping(value = "/privilege")
    public ModelAndView getUi() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView privilegeUi = new ModelAndView();
        privilegeUi.addObject("loggedusername" , authentication.getName());
        privilegeUi.addObject("title", "Privilege Management");
        privilegeUi.setViewName("privilege.html");
        return privilegeUi;
    }

    @Override
    @GetMapping(value = "/privilege/alldata", produces = "application/json")
    public List<Privilege> findAllData() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(),"Privilege");
        if(userPrivi.getPrivi_select()){
            return privilegeDao.findAll();
        }else{
            return new ArrayList<>();
        }
    }

    @Override
    @PostMapping(value = "/privilege/insert")
    public String saveData(@RequestBody Privilege privilege) {
        // check user privilege
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Privilege");
        if(!userPrivi.getPrivi_insert()){
            return "Privilege Save not completed : User haven't permission.";
        }

            // check duplicate
            Privilege extPrivilege = privilegeDao.getByRoleModule(privilege.getRole_id().getId(),
                    privilege.getModule_id().getId());
            if (extPrivilege != null) {
                return "Privilege Insert Not Completed : Privilege Already exists.";

            }
            try {
                // set auto generated values
                privilege.setAddeddatetime(LocalDateTime.now());

                // operation
                privilegeDao.save(privilege);
                // dependencies
                return "OK";
            } catch (Exception e) {
                return "Privilege insert not completed. " + e.getMessage();
            }


    }

    @Override
    @PutMapping(value = "/privilege/update")
    public String updateData(@RequestBody Privilege privilege) {
        // check logged user privilege
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Privilege");
        if(!userPrivi.getPrivi_insert()){
            return "Privilege Update not completed : User haven't permission.";
        }

            // check existence
            if (privilege.getId() == null) {
                return "Privilege update not completed :Privilege not exists. ";
            }

            if (privilegeDao.getReferenceById(privilege.getId()) == null) {
                return "Privilege update not completed : Privilege not exists.";
            }
            // check duplicate
            Privilege extPrivilege = privilegeDao.getByRoleModule(privilege.getRole_id().getId(),
                    privilege.getModule_id().getId());
            if (extPrivilege != null && extPrivilege.getId() != privilege.getId()) {
                return "Privilege Update Not Completed : Privilege Already exists.";
            }
            try {
                // set auto generated values
                privilege.setUpdateddatetime(LocalDateTime.now());
                // operation
                privilegeDao.save(privilege);
                // dependencies
                return "OK";
            } catch (Exception e) {
                return "Privilege update Not completed " + e.getMessage();
            }
    }

    @Override
    @DeleteMapping(value = "/privilege/delete")
    public String deleteData(@RequestBody Privilege privilege) {
        // check logged user privilege
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Privilege");
        if(!userPrivi.getPrivi_insert()){
            return "Privilege Delete not completed : User haven't permission.";
        }

            // check existence
            if (privilege.getId() == null) {
                return "Privilege delete not completed :Privilege not exists. ";
            }

            Privilege extPrivilege = privilegeDao.getReferenceById(privilege.getId());
            if (extPrivilege == null) {
                return "Privilege delete not completed : Privilege not exists.";
            }

            try {
                extPrivilege.setPrivi_select(false);
                extPrivilege.setPrivi_insert(false);
                extPrivilege.setPrivi_update(false);
                extPrivilege.setPrivi_delete(false);

                // operation
                // privilegeDao.delete(extPrivilege);
                privilegeDao.save(extPrivilege);

                // dependencies
                return "OK";
            } catch (Exception e) {
                return "Privilege delete Not completed " + e.getMessage();
            }
    }

}
