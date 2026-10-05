package lk.bookbarlibrary.membershiptype.contoller;

import lk.bookbarlibrary.AuthController;
import lk.bookbarlibrary.CommonController;
import lk.bookbarlibrary.membershiptype.dao.MembershipTypeDao;
import lk.bookbarlibrary.membershiptype.dao.MembershipTypeStatusDao;
import lk.bookbarlibrary.membershiptype.entity.MembershipType;
import lk.bookbarlibrary.privilege.entity.Privilege;
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
public class MembershipTypeContoller implements CommonController<MembershipType> {

    @Autowired
    private MembershipTypeDao membershipTypeDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private AuthController authController;

    @Autowired
    private MembershipTypeStatusDao membershipTypeStatusDao;

    @Override
    @RequestMapping(value = "/membershiptype")
    public ModelAndView getUi() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView membershipdetailsView = new ModelAndView();
        membershipdetailsView.addObject("loggedusername" , authentication.getName());
        membershipdetailsView.addObject("title", "Membership Type Management");
        membershipdetailsView.setViewName("membershiptype.html");
        return membershipdetailsView;
    }
    // create mapping for get membership type object by using given id (path variable)
    @GetMapping(value = "/membershiptype/byid/{membershiptypeid}" , produces = "application/json")
    public MembershipType getMembershipTypeById(@PathVariable Integer membershiptypeid){
        return membershipTypeDao.getReferenceById(membershiptypeid);
    }

    @RequestMapping(value = "/membershiptype/alldata", produces = "application/json")
    @Override
    public List<MembershipType> findAllData() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(), "Membership-Type");
        if(userPrivi.getPrivi_select()){
            return membershipTypeDao.findAll();
        }else {
            return new ArrayList<>();
        }
    }
    @RequestMapping(value = "/membershiptype/valid" , produces = "application/json")
    public List<MembershipType> findValidMemberships() {
        return membershipTypeDao.findValidMemberships();
    }

    @RequestMapping(value = "/adultmembershiptypes/valid" , produces = "application/json")
    public List<MembershipType> findAdultValidMemberships() {
        return membershipTypeDao.findAdultValidMemberships();
    }

    @RequestMapping(value = "/childmembershiptypes/valid" , produces = "application/json")
    public List<MembershipType> findChildValidMemberships() {
        return membershipTypeDao.findChildValidMemberships();
    }

    @PostMapping(value = "/membershiptype/insert")
    @Override
    public String saveData(@RequestBody MembershipType membershipType) {
        //checked loged user has permission for insert membership type record (check user authentication and authorization)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(), "Membership-Type");
        if(!userPrivi.getPrivi_insert()){
            return "Membership Type Save not completed : User haven't permission.";
        }
        // check duplicate for unique columns
        MembershipType extMembershipTypeByName= membershipTypeDao.getByName(membershipType.getName());
        if(extMembershipTypeByName!=null){
            return "Membership Type Save not completed : Given Name "+membershipType.getName()+"  Name Already Exists";
        }
        try {
            //set auto generated values
            membershipType.setAddeddatetime(LocalDateTime.now());
            User loggeduser = userDao.getByUsername(authentication.getName());
            membershipType.setAddeduserid(loggeduser.getId());

            // membership type no
            membershipTypeDao.save(membershipType);
            // check dependencies
            return "OK";

        }catch (Exception e){
            return "Membership type Save not completed."+e.getMessage();
        }
    }

    @PutMapping(value = "/membershiptype/update")
    @Override
    public String updateData(@RequestBody MembershipType membershipType) {
        //checked loged user has permission for insert membership type record (check user authentication and authorization)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(), "Membership-Type");
        if(!userPrivi.getPrivi_update()){
            return "Membership Type Update not completed : User haven't permission.";
        }
        // check existence
        if(membershipType.getId()==null){
            return "Membership Type Update not completed : Membership Type not exist.";
        }
        MembershipType extMembershipType=membershipTypeDao.getReferenceById(membershipType.getId());
        if(extMembershipType.getId()==null){
            return "Membership Type Update not completed : Membership Type not exist.";
        }
        // check duplicate for unique columns
        MembershipType extMembershipTypeByName= membershipTypeDao.getByName(membershipType.getName());
        if(extMembershipTypeByName!=null && extMembershipTypeByName.getId()!=extMembershipType.getId()){
            return "Membership Type Update not completed : Given Name "+membershipType.getName()+"  Name Already Exists";
        }
        // name is the only unique field for this module
        try {
            // set auto generated values
            membershipType.setUpdateddatetime(LocalDateTime.now());
            User loggeduser = userDao.getByUsername(authentication.getName());
            membershipType.setUpdateduserid(loggeduser.getId());

            // operation
            membershipTypeDao.save(membershipType);
            return "OK";
        }catch (Exception e){
            return "Membership Type Update not completed."+e.getMessage();
        }

    }

    @DeleteMapping(value = "/membershiptype/delete")
    @Override
    public String deleteData(@RequestBody MembershipType membershipType) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Membership-Type");
        if(!userPrivi.getPrivi_delete()){
            return "Membership Type Delete not completed : User haven't permission.";
        }
        // check existence
        if(membershipType.getId()==null){
            return "Membership Type Delete not completed : Membership Type not exist.";
        }
        MembershipType extMembershipType =membershipTypeDao.getReferenceById(membershipType.getId());
        if(extMembershipType.getId()==null){
            return "Membership Type Delete not completed : Membership Type not exist.";
        }
        try {
            //set auto generated values
            extMembershipType.setDeleteddatetime(LocalDateTime.now());
            User loggeduser = userDao.getByUsername(authentication.getName());
            extMembershipType.setDeleteduserid(loggeduser.getId());
            extMembershipType.setMembershiptypestatus_id(membershipTypeStatusDao.getReferenceById(3));
            // operation
            membershipTypeDao.save(extMembershipType);
            //membershipTypeDao.delete(membershipType);
            //dependencies

            return "OK";
        }catch(Exception e){
            return "Membership Type Delete not completed : "+e.getMessage();
        }
    }
}
