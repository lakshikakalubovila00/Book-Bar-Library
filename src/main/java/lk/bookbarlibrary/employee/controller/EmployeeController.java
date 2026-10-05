package lk.bookbarlibrary.employee.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import lk.bookbarlibrary.AuthController;
import lk.bookbarlibrary.privilege.entity.Privilege;
import lk.bookbarlibrary.user.dao.RoleDao;
import lk.bookbarlibrary.user.dao.UserDao;
import lk.bookbarlibrary.user.entity.Role;
import lk.bookbarlibrary.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import lk.bookbarlibrary.employee.dao.EmployeeDao;
import lk.bookbarlibrary.employee.dao.EmployeeStatusDao;
import lk.bookbarlibrary.employee.entity.Employee;

@RestController
public class EmployeeController {

    @Autowired // create instance for interfce with abstract methods
    private EmployeeDao employeeDao;

    @Autowired
    private AuthController authController;

    @Autowired
    private UserDao userDao;

    @Autowired
    private RoleDao roleDao;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired // create instance for interfce with abstract methods
    private EmployeeStatusDao employeeStatusDao;

    //create get mapping for get employee ui
    // employee ui service [URL ="/employee"]
    @RequestMapping(value = "/employee")
	public ModelAndView employeeUi(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(authentication.getName());
		ModelAndView employeeView = new ModelAndView();
        employeeView.addObject("loggedusername" , authentication.getName());
        employeeView.addObject("title", "Employee Management");
        employeeView.addObject("userphoto", loggedUser.getUserphoto());
		employeeView.setViewName("employee.html");
		return employeeView;
	}

    //create get mapping for get employee all data [URL Test : /employee/list]
    @GetMapping(value = "/employee/list")
    public List<Employee> getEmployeeList(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(),"Employee");
        if(userPrivi.getPrivi_select()){
            return employeeDao.findAll();
        }else{
            return new ArrayList<>();
        }

    }

    // create get mapping for get employee object by given id(Path variable) [URL Test : /employee/byid/1]
    @GetMapping(value = "/employee/byid/{empid}" , produces = "application/json")
    public  Employee getEmployeeById(@PathVariable Integer empid){
        return  employeeDao.getReferenceById(empid);
    }

    // create mapping for get employee object by using given id ( request param)
    @GetMapping(value = "/employee/byid" , params = {"id"}, produces = "application/json")
    public  Employee getEmployeeById2(@RequestParam Integer id){
        return  employeeDao.getReferenceById(id);
    }

    // create get mapping for get employee all data [URL Test : /employee/alldata]
    @GetMapping(value = "/employee/alldata" , produces="application/json")
    // define method for get employee data from database
    public List<Employee> getAllEmployeeData(){
        // return employeeDao.findAll();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(),"Employee");
        if(userPrivi.getPrivi_select()){
            return  employeeDao.getSelectedColumns();
        }else{
            return new ArrayList<>();
        }
    }

     // create post mapping for save or insert employee record [URL Test : /employee/insert]
    @PostMapping(value="/employee/insert")
    // write the ajax code on employee.js (buttonSubmitElement-postServiceResponse)
    public String saveEmployee(@RequestBody Employee employee) {

        System.out.println("Data :"+employee.getCallingname());
        //return "OK";
        //checked loged user has permission for insert employee record (check user authentication and authorization)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Employee");
        if(!userPrivi.getPrivi_insert()){
            return "Employee Save not completed : User haven't permission.";
        }

            //check duplicate for unique columns

            // check duplicate nic

            Employee extEmployeeByNic =employeeDao.getByNic(employee.getNic());
            if (extEmployeeByNic != null) {
                //return "Employee Save not completed : Nic already exists ";
                return "Employee Save not completed :Given Nic "+ employee.getNic()+" Nic already exists ";
                }

            //check duplicate email

            Employee extEmployeeByEmail =employeeDao.getByEmail(employee.getEmail());
            if (extEmployeeByEmail != null) {
                //return "Employee Save not completed : Email already exists ";
                return "Employee Save not completed : Given Email "+ employee.getEmail() +" Email already exists ";
                }

            //check duplicate mobile

            Employee extEmployeeByMobileNo =employeeDao.getByMobileNo(employee.getMobilenumber());
            if (extEmployeeByMobileNo != null) {
                //return "Employee Save not completed : Mobile Number already exists ";
                return "Employee Save not completed :Given Mobile Number "+ employee.getMobilenumber()+" Mobile Number already exists ";
                }
            // try operation
            try {
                //set auto genereted values

                employee.setAddeddatetime(LocalDateTime.now()); // set current datetime

                User loggeduser = userDao.getByUsername(authentication.getName());
                employee.setAddeduserid(loggeduser.getId()); // set Logged user id
                employee.setEmpno(employeeDao.getNextEmpNo());

                //do operator - save / insert operation
                Employee newEmployee=employeeDao.save(employee);

                // check dependencies
                //1 create user account
                User extUserByEmail= userDao.getByEmail(employee.getEmail());
                if(employee.getDesignation_id().getUseraccount()&& extUserByEmail==null){
                    User employeeUser = new User();
                    employeeUser.setUsername(employee.getEmpno());
                    employeeUser.setPassword(bCryptPasswordEncoder.encode(employee.getNic()));
                    employeeUser.setEmail(employee.getEmail());
                    employeeUser.setUserstatus(Boolean.TRUE);
                    employeeUser.setUserphoto(employee.getEmployeephoto());
                    employeeUser.setEmployee_id(newEmployee);
                    employeeUser.setAddeddatetime(LocalDateTime.now());
                    Role employeeRole= roleDao.getReferenceById(employee.getDesignation_id().getRole_id());
                    Set<Role> userRoles=new HashSet<Role>();
                    userRoles.add(employeeRole);
                    employeeUser.setRoles(userRoles);

                    userDao.save(employeeUser);
                    System.out.println("User account created successfully");
                }else{
                    System.out.println("User account not created : This email has user account");
                }
                return "OK";
            } catch (Exception e) {
               return "Employee insert not completed."+e.getMessage();
            }
    }
    
    // define request mapping for update employee record [URL="/employee/update"]
    @PutMapping(value="/employee/update")
    public String updateEmployee(@RequestBody Employee employee){
        System.out.println("Data :"+employee.getCallingname());
        //return "OK";
        //checked loged user has permission for update employee record (check user authentication and authorization)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Employee");
        if(!userPrivi.getPrivi_update()){
            return "Employee update not completed : User haven't permission.";
        }

            //check existence
            // get id form the object
            if (employee.getId()==null) {
                return "Employee Update not completed , Employee not exist..! ";
            }
            // get id form the database check this Employee is existing
            Employee extEmployee= employeeDao.getReferenceById(employee.getId());
            if (extEmployee.getId()==null) {
                return "Employee Update not completed , Employee not exist..! ";
            }
            //check duplicate for unique columns

            // check duplicate nic

            Employee extEmployeeByNic =employeeDao.getByNic(employee.getNic());
            if (extEmployeeByNic != null && extEmployeeByNic.getId()!=extEmployee.getId()) {
                //return "Employee update not completed : Nic already exists ";
                return "Employee Update not completed :Given Nic "+ employee.getNic()+" Nic already Exist..! ";
                }

            //check duplicate email

            Employee extEmployeeByEmail =employeeDao.getByEmail(employee.getEmail());
            if (extEmployeeByEmail != null && extEmployeeByEmail.getId()!=extEmployee.getId()) {
                //return "Employee update not completed : Email already exists ";
                return "Employee Update not completed :Given Email "+ employee.getEmail() +" Email already Exist..! ";
                }

            //check duplicate mobile

            Employee extEmployeeByMobileNo =employeeDao.getByMobileNo(employee.getMobilenumber());
            if (extEmployeeByMobileNo != null && extEmployeeByMobileNo.getId()!=extEmployee.getId()) {
                //return "Employee update not completed : Mobile Number already exists ";
                return "Employee Update not completed :Given Mobile Number "+ employee.getMobilenumber()+" Mobile Number already exists ";
                }
            // try operation
            try {
                //1. set auto genereted values

                employee.setUpdateddatetime(LocalDateTime.now()); // set current datetime
                User loggeduser = userDao.getByUsername(authentication.getName());
                employee.setUpdateduserid(loggeduser.getId()); // set Logged user id
                

                //2 .do operator - save / insert operation
                employeeDao.save(employee);

                //3.check dependencies
                // if user account exist need to inactive
                if(employee.getEmployeestatus_id().getName().equals("Resign")){
                    User empUser= userDao.getByEmployee_id(employee.getId());
                    if(empUser!=null){
                        empUser.setUserstatus(Boolean.FALSE);
                        empUser.setUserphoto(employee.getEmployeephoto());
                        userDao.save(empUser);
                    }
                }
                if(employee.getEmployeestatus_id().getName().equals("Fired")){
                    User empUser= userDao.getByEmployee_id(employee.getId());
                    if(empUser!=null){
                        empUser.setUserstatus(Boolean.FALSE);
                        empUser.setUserphoto(employee.getEmployeephoto());
                        userDao.save(empUser);
                    }
                }
                // active if working
                if(employee.getEmployeestatus_id().getName().equals("Working")){
                    User empUser= userDao.getByEmployee_id(employee.getId());
                    if(empUser!=null){
                        empUser.setUserstatus(Boolean.TRUE);
                        empUser.setUserphoto(employee.getEmployeephoto());
                        userDao.save(empUser);
                    }
                }
                return "OK";

            } catch (Exception e) {
               return "Employee Update not completed."+e.getMessage();
            }
    }

    // create delete mapping for delete employee record [url = "employee/delete"]
    @DeleteMapping(value="/employee/delete")
    public String deleteEmployee(@RequestBody Employee employee){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Employee");
        if(!userPrivi.getPrivi_delete()){
            return "Employee Delete not completed : User haven't permission.";
        }
            // check employee exist
            if(employee.getId()==null){
                return "Employee Delete not completed : Employee not exist.";
            }
            Employee extEmployee= employeeDao.getReferenceById(employee.getId());
            if(extEmployee.getId()==null){
                return "Employee Delete not completed : Employee not exist.";
            }

            try {
                //set auto genereted alue
                extEmployee.setDeleteddatetime(LocalDateTime.now()); // set current datetime

                User loggeduser = userDao.getByUsername(authentication.getName());
                extEmployee.setDeleteduserid(loggeduser.getId()); // set Logged user id

                // set status as deleted
                extEmployee.setEmployeestatus_id(employeeStatusDao.getReferenceById(4));
                
                //operation

                //employeeDao.delete(employee);
                employeeDao.save (extEmployee);

                //dependencies
                // if user account exist need to inactive
                    User empUser= userDao.getByEmployee_id(employee.getId());
                    if(empUser!=null){
                        empUser.setUserstatus(Boolean.FALSE);
                        userDao.save(empUser);
                    }

                return "OK";

            } catch (Exception e) {
                return  "Employee Delete not completed."+e.getMessage();
            }
    }

}
