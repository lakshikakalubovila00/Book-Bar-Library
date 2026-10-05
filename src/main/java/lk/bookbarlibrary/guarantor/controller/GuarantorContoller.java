package lk.bookbarlibrary.guarantor.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import lk.bookbarlibrary.AuthController;
import lk.bookbarlibrary.guarantor.dao.GuarantorStatusDao;
import lk.bookbarlibrary.guarantor.entity.GuarantorStatus;
import lk.bookbarlibrary.privilege.entity.Privilege;
import lk.bookbarlibrary.user.dao.UserDao;
import lk.bookbarlibrary.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import lk.bookbarlibrary.CommonController;
import lk.bookbarlibrary.guarantor.dao.GuarantorDao;
import lk.bookbarlibrary.guarantor.entity.Guarantor;

@RestController
public class GuarantorContoller implements CommonController<Guarantor> {

    @Autowired
    private GuarantorDao guarantorDao;
    @Autowired
    private AuthController authController;

    @Autowired
    private UserDao userDao;

    @Autowired
    private GuarantorStatusDao guarantorStatusDao;

    @Override
    @RequestMapping(value = "/guarantor")
    public ModelAndView getUi() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView guaranteeView = new ModelAndView();
        guaranteeView.addObject("loggedusername" , authentication.getName());
        guaranteeView.addObject("title", "Guarantor Management");
        guaranteeView.setViewName("guarantor.html");
        return guaranteeView;
    }

    // http://localhost:8080/guarantor/search?nic=196278567789&mobileno=0723456789
    @GetMapping("/guarantor/search")
    public Guarantor searchGuarantor(
            @RequestParam String nic,
            @RequestParam String mobileno ) {

        return guarantorDao.searchByNicORMobileNo(nic, mobileno);
    }

    // create mapping for get guarantor object by using given id (path variable)
    @GetMapping(value = "/guarantor/byid/{guarantorid}", produces = "application/json")
    public Guarantor getGuarantorById(@PathVariable Integer guarantorid) {
        return guarantorDao.getReferenceById(guarantorid);
    }

    @Override
    @GetMapping(value = "/guarantor/alldata", produces = "application/json")
    public List<Guarantor> findAllData() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(),"Guarantor");
        if(userPrivi.getPrivi_select()){
            return guarantorDao.findAll();
        }else{
            return new ArrayList<>();
        }

    }

    @GetMapping(value = "/guarantor/bynic/{guarantornic}", produces = "application/json")
    public Guarantor getGuarantorByNic(@PathVariable("guarantornic") String guarantornic) {
         return guarantorDao.getGuarantorByNic(guarantornic);

    }

    @Override
    @PostMapping(value = "/guarantor/insert")
    public String saveData(@RequestBody Guarantor guarantor) {
        // check user privilege
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Guarantor");
        if(!userPrivi.getPrivi_insert()){
            return "Guarantor Save not completed : User haven't permission.";
        }

            // check duplicate nic
            Guarantor extGuarantorByNic = guarantorDao.getByNic(guarantor.getNic());
            if (extGuarantorByNic != null) {
                return "Guarantor Save not completed : Given Nic " + guarantor.getNic() + "Nic already exists";
            }
            // duplicate email
        Guarantor extGuarantorByEmail=guarantorDao.getByEmail(guarantor.getEmail());
            if (extGuarantorByEmail != null) {
                return "Guarantor Save not completed : Given Email " + guarantor.getEmail() + "Email already exists";
            }
            // check duplicate mobile no
        Guarantor extGuarantorByMobileNo = guarantorDao.getByMobileno(guarantor.getMobileno());
            if (extGuarantorByMobileNo != null) {
                return "Guarantor Save not completed : Given Mobile No " + guarantor.getMobileno() + "Mobile No already exists";
            }


            // try operation
            try {
                // set auto generated value
                // set added date time
                guarantor.setAddeddatetime(LocalDate.now()); // set current datetime

                // set added user id

                User loggeduser = userDao.getByUsername(authentication.getName());
                guarantor.setAddeduserid(loggeduser.getId()); // set Logged user id

                // do opeartion
                guarantorDao.save(guarantor);

                // check dependencies
                return "OK";
            } catch (Exception e) {
                return "Guarantor insert not completed. " + e.getMessage();
            }

    }

    @Override
    @PutMapping(value = "/guarantor/update")
    public String updateData(@RequestBody Guarantor guarantor) {
        // check userhas permission
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Guarantor");
        if(!userPrivi.getPrivi_update()){
            return "Guarantor Update not completed : User haven't permission.";
        }

            //check existence
            if (guarantor.getId() == null) {
                return "Guarantor Update not completed , Guarantor not already Exist..!";
            }
            Guarantor extGuarantor = guarantorDao.getReferenceById(guarantor.getId());
            if (extGuarantor.getId() == null) {
                return "Guarantor Update not completed , Guarantor not already Exist..!";
            }

            // check duplicate for unique columns

            // duplicate nic
            Guarantor extGuarantorByNic = guarantorDao.getByNic(guarantor.getNic());
            if (extGuarantorByNic != null && extGuarantorByNic.getId() != extGuarantor.getId()) {
                return "Guarantor Update not completed : Given Nic " + guarantor.getNic() + "Nic already Exist..!";
            }

            // duplicate email
        Guarantor extGuarantorByEmail = guarantorDao.getByEmail(guarantor.getEmail());
            if(extGuarantorByEmail != null  && extGuarantorByEmail.getId() != extGuarantor.getId()){
                return "Guarantor Update not completed : Given Email " + guarantor.getEmail() + "Email already Exist..!";
            }

            // ducplicate mobile
        Guarantor extGurantorByMobileNo= guarantorDao.getByMobileno(guarantor.getMobileno());
            if(extGurantorByMobileNo != null && extGurantorByMobileNo.getId() != extGuarantor.getId()){
                return "Guarantor Updata not completed : Given Mobile No "+guarantor.getMobileno()+"Mobile No already Exist..!";
            }
            // try operation
            try {
                guarantor.setUpdateddatetime(LocalDate.now());

                User loggeduser = userDao.getByUsername(authentication.getName());
                guarantor.setUpdateduserid(loggeduser.getId()); // set Logged user id

                // do operation
                guarantorDao.save(guarantor);
                // check dependencies
                return "OK";
            } catch (Exception e) {
                return "Guarantor update not completed. " + e.getMessage();
            }

    }

    @Override
    @DeleteMapping(value = "/guarantor/delete")
    public String deleteData(@RequestBody Guarantor guarantor) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Guarantor");
        if(!userPrivi.getPrivi_delete()){
            return "Guarantor Delete not completed : User haven't permission.";
        }
            // check existence
            if (guarantor.getId() == null) {
                return "Guarantor Delete not completed , Guarantor not already Exist..!";
            }
            Guarantor extGuarantor = guarantorDao.getReferenceById(guarantor.getId());
            if (extGuarantor.getId() == null) {
                return "Guarantor Delete not completed , Guarantor not already Exist..!";
            }

            //try operation
            try {
                //set auto generated value
                extGuarantor.setDeleteddatetime(LocalDate.now());

                User loggeduser = userDao.getByUsername(authentication.getName());
                extGuarantor.setDeleteduserid(loggeduser.getId()); // set Logged user id
                // update status
                extGuarantor.setGuarantorstatus_id(guarantorStatusDao.getReferenceById(3));

                // operation
                guarantorDao.save(extGuarantor);
                //guarantorDao.delete(guarantor);
                return "OK";

            } catch (Exception e) {
                return "Guarantor delete not completed. " + e.getMessage();
            }
    }

}
