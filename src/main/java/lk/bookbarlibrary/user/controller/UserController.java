package lk.bookbarlibrary.user.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lk.bookbarlibrary.AuthController;
import lk.bookbarlibrary.privilege.entity.Privilege;
import lk.bookbarlibrary.user.entity.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import lk.bookbarlibrary.user.dao.UserDao;
import lk.bookbarlibrary.user.entity.User;

@RestController
public class UserController {

    @Autowired
    private UserDao userDao;

    @Autowired
    private AuthController authController ;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    // create get mapping for get user ui [URL="/user"]
    @RequestMapping(value = "/user")
	public ModelAndView userUi(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		ModelAndView userView = new ModelAndView();
        userView.addObject("loggedusername" , authentication.getName());
        userView.addObject("title", "User Management");
		userView.setViewName("user.html");
		return userView;
	}

    // creatr get mapping for get user by id
    @GetMapping(value = "/user/byid/{id}", produces = "application/json")
    public User getRoleByUserId(@PathVariable("id") Integer id) {
        return userDao.getReferenceById(id);

    }


    //create get mapping for get user all data [URL="user/alldata"]
    @GetMapping(value = "/user/alldata" , produces = "application/json" )
    public List<User> getUserAllData() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"User");
        if(userPrivi.getPrivi_select()){
            return userDao.getSelectedColumns();
        }else{
            return new ArrayList<>();
        }
    }

    @GetMapping(value = "/user/loggeduser", produces = "application/json")
    public User getLoggedUser(Authentication authentication) {
        String username = authentication.getName();
        return userDao.getByUsername(username);
    }

    // create post mapping for insert user record [url= "/user/insert"]
    @PostMapping(value="/user/insert")
    public String saveUser(@RequestBody User user) {
        // check logged user privilegs
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(),"User");
        if(!userPrivi.getPrivi_insert()){
            return "User Save not completed : User haven't permission.";
        }
            // user has permission
            //check duplicate
            //name duplicate
            User extUserByName= userDao.getByUsername(user.getUsername());
        if(extUserByName!=null){
            return "User save not complete : User name already exists.";
        }

            //email duplicate
            User extUserByEmail= userDao.getByEmail(user.getEmail());
            if (extUserByEmail != null) {
                // already have
                return "User save not complete : User email already exists";
            }
            // one user account one employee - according to domain
            User extUserByEmployee= userDao.getByEmployee_id(user.getEmployee_id().getId());
            if (extUserByEmployee != null) {
                // already have
                return "User save not complete : Employee already exists";
            }
            if(!user.getEmployee_id().getDesignation_id().getUseraccount()){
                return "User save not complete : This employee designation cannot have a user account.";
            }
            try {

                //set auto genereted values -* Not yet
                user.setAddeddatetime(LocalDateTime.now());
                // user password need to encrypted
                user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
                //operation
                userDao.save(user);

                //dependencies

                return "OK";

            } catch (Exception e) {
                return "User Insert Not Completed : "+e.getMessage();
            }
        
    }

    // create put mapping for update user record [url= "/user/update"]
     @PutMapping(value="/user/update")
     public String updateUser(@RequestBody User user) {
         // check logged user privilegs
         Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
         Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(),"User");
         if(!userPrivi.getPrivi_update()){
             return "User Update not completed : User haven't permission.";
         }

             // user has permission

             //check existence
             if (user.getId()==null) {
                return "Update not completed : User not exist.";
             }
             User extUser= userDao.getReferenceById(user.getId());
             if (extUser==null) {
                return "Update not completed : User not exist.";
             }
            
             //check duplicate
            //name duplicate
            User extUserByName= userDao.getByUsername(user.getUsername());
             if(extUserByName!=null && extUserByName.getId()!=extUser.getId()){
                 return "User update not complete : Username already exists.";
             }
             //email duplicate
             User extUserByEmail= userDao.getByEmail(user.getEmail());
             if (extUserByEmail != null && extUserByEmail.getId()!=extUser.getId()) {
                 // alrady have
                 return "User update not complete : User email already exists";
             }
             // one user account one employee - according to domain
             User extUserByEmployee= userDao.getByEmployee_id(user.getEmployee_id().getId());
             if (extUserByEmployee != null && extUserByEmployee.getId()!=extUser.getId()) {
                 // alrady have
                 return "User update not complete : Employee already exists";
             }
             try {
                 
                 //set auto genereted values
                 user.setUpdateddatetime(LocalDateTime.now());
                 // user password need to encrypted
 
                 //operation
                 userDao.save(user);
 
                 //dependencies
 
                 return "OK";
 
             } catch (Exception e) {
                 return "User Update Not Completed : "+e.getMessage();
             }
         
     }


     // create DELETE mapping for delete user record [url= "/user/delete"]
     @DeleteMapping(value="/user/delete")
     public String deleteUser(@RequestBody User user) {
         // check logged user privilegs
         Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
         Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(),"User");
         if(!userPrivi.getPrivi_delete()){
             return "User Delete not completed : User haven't permission.";
         }

             // user has permission
             
             //check existence
             if (user.getId()==null) {
                return "Delete not completed : User not exist.";
             }

             User extUser= userDao.getReferenceById(user.getId());
             if (extUser==null) {
                return "Delete not completed : User not exist.";
             }
            
             try {
                 
                 //set auto genereted values -* Not yet
                 // user password need to encrypted
                 
                 extUser.setUserstatus(false);
                 //operation

                 //userDao.delete(extuser)
                 userDao.save(extUser);
 
                 //dependencies
 
                 return "OK";
 
             } catch (Exception e) {
                 return "User Delete Not Completed : "+e.getMessage();
             }
         
     }
    

}
