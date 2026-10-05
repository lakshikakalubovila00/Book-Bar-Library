package lk.bookbarlibrary;

import lk.bookbarlibrary.employee.dao.EmployeeDao;
import lk.bookbarlibrary.employee.entity.Employee;
import lk.bookbarlibrary.user.dao.RoleDao;
import lk.bookbarlibrary.user.dao.UserDao;
import lk.bookbarlibrary.user.entity.ChangeUser;
import lk.bookbarlibrary.user.entity.Role;
import lk.bookbarlibrary.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.bind.annotation.GetMapping;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;


@RestController // active services
    public class LoginController {

    @Autowired
    private UserDao userDao;

    @Autowired
    private RoleDao roleDao;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private EmployeeDao employeeDao;

        // get mapping for load login.html
    @GetMapping(value="/login")
    public ModelAndView loginUi(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView loginView = new ModelAndView();
        loginView.addObject("loggedusername", authentication.getName());
        loginView.addObject("title", "Login");
        loginView.setViewName("login.html");
        return loginView;
    }

    // get mapping for load dashboard
    @GetMapping(value="/dashboard")
    public ModelAndView dashboardUi(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView dashboardView = new ModelAndView();
        dashboardView.addObject("loggedusername" , authentication.getName());
        dashboardView.addObject("title", "Dashboard");
        dashboardView.setViewName("dashboard.html");
        return dashboardView;
    }

    @GetMapping(value="/overdueborrowings")
    public ModelAndView overdueBorrowingsUi(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView overdueBorrowingsView = new ModelAndView();
        overdueBorrowingsView.addObject("loggedusername" , authentication.getName());
        overdueBorrowingsView.addObject("title", "Overdue Borrowings");
        overdueBorrowingsView.setViewName("overdueborrowings.html");
        return overdueBorrowingsView;
    }
    @GetMapping(value="/expiredreservations")
    public ModelAndView overdueReservationsUi(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView overdueReservationsView = new ModelAndView();
        overdueReservationsView.addObject("loggedusername" , authentication.getName());
        overdueReservationsView.addObject("title", "Expired Reservations");
        overdueReservationsView.setViewName("expiredreservations.html");
        return overdueReservationsView;
    }
    @GetMapping(value="/expiredmemberships")
    public ModelAndView expiredMembershipsUi(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView expiredMembershipsView = new ModelAndView();
        expiredMembershipsView.addObject("loggedusername" , authentication.getName());
        expiredMembershipsView.addObject("title", "Overdue Borrowings");
        expiredMembershipsView.setViewName("expiredmemberships.html");
        return expiredMembershipsView;
    }


    @GetMapping(value="/editprofile")
    public ModelAndView editProfileUi(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView editProfileView = new ModelAndView();
        editProfileView.addObject("loggedusername" , authentication.getName());
        editProfileView.addObject("title", "Edit Profile");
        editProfileView.setViewName("editprofile.html");
        return editProfileView;
    }


    // get mapping error page
    @GetMapping(value="/errorpage")
    public ModelAndView errorpageUi(){
        ModelAndView errorpageView = new ModelAndView();
        errorpageView.setViewName("errorpage.html");
        return errorpageView;
    }

    @GetMapping(value="/createadmin")
    public String createAdmin(){
        User extAdmin = userDao.getByUsername("admin");
        if(extAdmin==null){
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(bCryptPasswordEncoder.encode("1234"));
            admin.setUserstatus(Boolean.TRUE);

            Set<Role> roleList = new HashSet<>();
            roleList.add(roleDao.getReferenceById(1));
            admin.setRoles(roleList);

            // company email
            admin.setEmail("admin@gmail.com");

            admin.setAddeddatetime(LocalDateTime.now());

            userDao.save(admin);
            System.out.println("Admin created");
            return "redirect:/login";

        }else {
            // return "<script>window.location.replace('/login')</script>";
            return "redirect:/login";
        }
    }

    @GetMapping(value="/getloggeduser")
    public ChangeUser getLoggedUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User loggeduser = userDao.getByUsername(authentication.getName());
        ChangeUser changeUser = new ChangeUser(loggeduser.getUsername(),loggeduser.getUsername(),null,loggeduser.getEmail(),loggeduser.getUserphoto());
        return changeUser;
    }

    @PostMapping(value="/savechangeprofile")
    public String changeUserProfileSave(@RequestBody ChangeUser changeUser){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User loggeduser = userDao.getByUsername(authentication.getName());

        // duplicate username
        User extUserByUsername =userDao.getByUsername(changeUser.getUsername());
        if (extUserByUsername != null && !extUserByUsername.getUsername().equals(loggeduser.getUsername())) {
            return "Save not completed : Given Username "+ changeUser.getUsername() +" already exists ";
        }

        // duplicate email
        User extUserByEmail =userDao.getByEmail(changeUser.getEmail());
        if (extUserByEmail != null && !extUserByEmail.getEmail().equals(loggeduser.getEmail())) {
            return "Save not completed : Given Email "+ changeUser.getEmail() +" already exists ";
        }

        try{
            User user = userDao.getByUsername(authentication.getName());

            user.setUserphoto(changeUser.getUserphoto());
            user.setUsername(changeUser.getUsername());
            user.setEmail(changeUser.getEmail());

            // if have a new password
            if(changeUser.getNewpassword()!=null){
                //if matches - no changes
                if(bCryptPasswordEncoder.matches(changeUser.getNewpassword(),user.getPassword())){
                    return "Save Not Completed : Password Match to Previous Password";
                }else{
                    // new password
                    user.setPassword(bCryptPasswordEncoder.encode(changeUser.getNewpassword()));
                }
            }

            userDao.save(user);
            return "OK";

        }catch(Exception e){
            return "Changes not completed."+e.getMessage();
        }

    }
    
}
