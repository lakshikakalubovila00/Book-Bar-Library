package lk.bookbarlibrary.supplier.controller;

import lk.bookbarlibrary.AuthController;
import lk.bookbarlibrary.CommonController;
import lk.bookbarlibrary.privilege.entity.Privilege;
import lk.bookbarlibrary.supplier.dao.SupplierDao;
import lk.bookbarlibrary.supplier.dao.SupplierStatusDao;
import lk.bookbarlibrary.supplier.entity.Supplier;
import lk.bookbarlibrary.user.dao.UserDao;
import lk.bookbarlibrary.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
public class SupplierController implements CommonController<Supplier> {

    @Autowired
    private SupplierDao supplierDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private AuthController authController;

    @Autowired
    private SupplierStatusDao supplierStatusDao;

    @RequestMapping(value="/supplier")
    @Override
    public ModelAndView getUi() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView supplierView = new ModelAndView();
        supplierView.addObject("loggedusername", authentication.getName());
        supplierView.addObject("title", "Supplier Management");
        supplierView.setViewName("supplier.html");
        return supplierView;
    }

    @RequestMapping(value = "/supplier/alldata",produces = "application/json")
    @Override
    public List<Supplier> findAllData() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(), "Supplier");
        if(userPrivi.getPrivi_select()){
            return supplierDao.findAll();
        }else {
            return new ArrayList<>();
        }
    }

    // create get mapping for get supplier object by given id(Path variable) [URL Test : /supplier/byid/1]
    @GetMapping(value = "/supplier/byid/{supplierid}", produces = "application/json")
    public Supplier getSupplierById(@PathVariable Integer supplierid) {
        return  supplierDao.getReferenceById(supplierid);
    }

    @GetMapping(value = "/suppliers/bybook/{booktitle}", produces = "application/json")
    public List<Supplier> getSupplierByBookTitle(@PathVariable String booktitle) {
        return supplierDao.getSuppliersByBook(booktitle);
    }

    // create post mapping for save or insert supplier record [URL Test : /supplier/insert]
    @PostMapping(value = "/supplier/insert")
    @Override
    public String saveData(@RequestBody Supplier supplier) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(), "Supplier");
        if(!userPrivi.getPrivi_insert()){
            return "Supplier save not completed : User haven't permission.";
        }
        //check duplicate for unique columns

        // duplicate business registration no
        Supplier extSupplierByBRNo= supplierDao.getByBusinessregistrationno(supplier.getBusinessregistrationno());
        if(extSupplierByBRNo!=null){
            return "Supplier save not completed : Given Business Registration No : "+supplier.getBusinessregistrationno() +" Business Registration No exists ";
        }
        // duplicate email
        Supplier extSupplierByEmail=supplierDao.getByEmail(supplier.getEmail());
        if(extSupplierByEmail!=null){
            return "Supplier save not completed : Given Email " +supplier.getEmail() +" Email already exists ";
        }
        // duplicate contact no
        Supplier extSupplierByContactno= supplierDao.getByContactno(supplier.getContactno());
        if(extSupplierByContactno!=null){
            return "Supplier save not completed : Given Contactno " +supplier.getContactno() +" Contact no already exists ";
        }
        // duplicate bank accountno
        Supplier extSupplierByAccount= supplierDao.getByAccountno(supplier.getAccountno());
        if(extSupplierByAccount!=null){
            return "Supplier save not completed : Given Bank Account No" +supplier.getAccountno() +" Bank Account No already exists ";
        }
        //try operation
        try{
            //set auto generated values
            // set current datetime
            supplier.setAddeddatetime(LocalDateTime.now());

            // set Logged user id
            User loggeduser = userDao.getByUsername(authentication.getName());
            supplier.setAddeduserid(loggeduser.getId());

            //do operator - save / insert operation
            supplierDao.save(supplier);

            // check dependencies
            return "OK";
        }catch(Exception e){
            return "Supplier save not completed : "+e.getMessage();
        }

    }

    // define request mapping for update supplier record [URL="/supplier/update"]
    @PutMapping(value="/supplier/update")
    @Override
    public String updateData(@RequestBody Supplier supplier) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(), "Supplier");
        if(!userPrivi.getPrivi_update()){
            return "Supplier update not completed : User haven't permission.";
        }
        //check existence
        // get id from the object
        if(supplier.getId()==null){
            return "Supplier update not completed : Supplier not exist..!";
        }
        // get id form the database check this supplier is existing
        Supplier extSupplier= supplierDao.getReferenceById(supplier.getId());
        if(extSupplier.getId()==null){
            return "Supplier update not completed : Supplier not exist..!";
        }
        // check duplicate for unique columns

        // duplicate business registration no
        Supplier extSupplierByBRNo= supplierDao.getByBusinessregistrationno(supplier.getBusinessregistrationno());
        if(extSupplierByBRNo!=null && extSupplierByBRNo.getId()!=supplier.getId()){
            return "Supplier update not completed : Given Business Registration No : "+supplier.getBusinessregistrationno() +" Business Registration No exists";
        }

        // duplicate email
        Supplier extSupplierByEmail=supplierDao.getByEmail(supplier.getEmail());
        if(extSupplierByEmail!=null && extSupplierByEmail.getId()!=extSupplier.getId()){
            return "Supplier update not completed : Given Email " +supplier.getEmail() +" Email already exists ";
        }

        // duplicate contact no
        Supplier extSupplierByContactno= supplierDao.getByContactno(supplier.getContactno());
        if(extSupplierByContactno!=null && extSupplierByContactno.getId()!=extSupplier.getId()){
            return "Supplier update not completed : Given Contactno " +supplier.getContactno() +" Contact no already exists ";
        }

        // duplicate account no
        Supplier extSupplierByAccountno= supplierDao.getByAccountno(supplier.getAccountno());
        if(extSupplierByAccountno!=null && extSupplierByAccountno.getId()!=extSupplier.getId()){
            return "Supplier update not completed : Given Accountno " +supplier.getAccountno() +" Account No already exists ";
        }
        try{
            //set auto generated values
            // set current datetime
            supplier.setUpdateddatetime(LocalDateTime.now());
            // set Logged user id
            User loggeduser = userDao.getByUsername(authentication.getName());
            supplier.setUpdateduserid(loggeduser.getId());

            //do operation
            supplierDao.save(supplier);
            return "OK";
        }catch(Exception e){
            return "Supplier update not completed : "+e.getMessage();
        }
    }

    // create delete mapping for delete supplier record [url = "supplier/delete"]
    @DeleteMapping(value="/supplier/delete")
    @Override
    public String deleteData(@RequestBody Supplier supplier) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(), "Supplier");
        if(!userPrivi.getPrivi_delete()){
            return "Supplier delete not completed : User haven't permission.";
        }
        // check supplier exist
        // get id from the object
        if(supplier.getId()==null){
            return "Supplier delete not completed : Supplier not exist..!";
        }
        // get id form the database check this supplier is existing
        Supplier extSupplier= supplierDao.getReferenceById(supplier.getId());
        if(extSupplier.getId()==null){
            return "Supplier delete not completed : Supplier not exist..!";
        }
        try {
            // set auto generated values
             // set current datetime
            extSupplier.setDeleteddatetime(LocalDateTime.now());

            // set Logged user id

            User loggeduser = userDao.getByUsername(authentication.getName());
            extSupplier.setDeleteduserid(loggeduser.getId());
            extSupplier.setSupplierstatus_id(supplierStatusDao.getReferenceById(4));

            //operation
            supplierDao.save(extSupplier);
            //supplierDao.delete(supplier);

            //dependencies
            return "OK";

        }catch(Exception e){
            return "Supplier delete not completed : "+e.getMessage();
        }
    }
}
