package lk.bookbarlibrary.membership.controller;

import lk.bookbarlibrary.AuthController;
import lk.bookbarlibrary.CommonController;
import lk.bookbarlibrary.member.dao.MemberDao;
import lk.bookbarlibrary.member.entity.Member;
import lk.bookbarlibrary.membership.dao.MembershipDao;
import lk.bookbarlibrary.membership.dao.MembershipStatusDao;
import lk.bookbarlibrary.membership.entity.Membership;
import lk.bookbarlibrary.membershiptype.dao.MembershipTypeStatusDao;
import lk.bookbarlibrary.privilege.entity.Privilege;
import lk.bookbarlibrary.reservation.entity.Reservation;
import lk.bookbarlibrary.user.dao.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
public class MembershipController implements CommonController<Membership> {
    @Autowired
    private MembershipDao membershipDao;

    @Autowired
    private AuthController authController;

    @Autowired
    private UserDao userDao;

    @Autowired
    private MemberDao memberDao;

    @Autowired
    private MembershipStatusDao membershipStatusDao;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    // mapping for new membership module
    @Override
    @RequestMapping(value = "/membershipnew")
    public ModelAndView getUi() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView membershipnewView = new ModelAndView();
        membershipnewView.addObject("loggedusername" , authentication.getName());
        membershipnewView.addObject("title", "New Membership");
        membershipnewView.setViewName("membershipnew.html");
        return membershipnewView;
    }

    // mapping for renew membership module
    @RequestMapping(value = "/membershiprenewal")
    public ModelAndView membershiprenewalUI() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView membershiprenewalView = new ModelAndView();
        membershiprenewalView.addObject("loggedusername" , authentication.getName());
        membershiprenewalView.addObject("title", "Renew Membership");
        membershiprenewalView.setViewName("membershiprenewal.html");
        return membershiprenewalView;
    }

    // mapping for get all data
    @GetMapping(value = "/membership/alldata", produces = "application/json")
    @Override
    public List<Membership> findAllData() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(),"New-Membership");
        if(userPrivi.getPrivi_select()){
            return membershipDao.findAll();
        }else {
            return new ArrayList<>();
        }
    }

    // crete get mapping for get membership object by given id(Path variable)
    @GetMapping(value = "/membership/byid/{membershipid}" , produces = "application/json")
    private Membership getMembershipById(@PathVariable Integer membershipid) {
        return membershipDao.getReferenceById(membershipid);
    }

    //get last record of a member's memberships
    @GetMapping(value = "/membership/bymember/{memberid}", produces = "application/json")
    public Membership getMembershipByMemberid(@PathVariable Integer memberid) {
        return membershipDao.filterbymemberid(memberid);
    }

    // expired memberships list
    @GetMapping(value = "/expiredmembershipslist", produces = "application/json")
    public List<Membership> getExpiredMemberships(){
        return membershipDao.getExpiredMemberships();
    }

    // get status expired memberships list
    @GetMapping(value = "/memberships/expired", produces = "application/json")
    public List<Membership> getStatusExpiredMemberships(){
        return membershipDao.getStatusExpiredMemberships();
    }

    // create post mapping for save or insert membership record
    @PostMapping(value = "/membership/insert")
    @Override
    public String saveData(@RequestBody Membership membership) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(),"New-Membership");
        if(!userPrivi.getPrivi_insert()){
            return "Membership Save not completed : User haven't permission.";
        }
        // check duplicate for unique columns - No Unique columns
        // try operation
        try {
            // set auto generate values
            // set current datetime
            membership.setAddeddatetime(LocalDateTime.now());
            // if new membership set username, password and account status

            if(membership.getMembershipcategory_id().getName().equals("New")){

                Member member= membership.getMember_id();

                member.setAccountstatus(Boolean.TRUE);
                // do operation
                memberDao.save(member);
            }

            // set Logged user id
            membership.setAddeduserid(userDao.getByUsername(authentication.getName()).getId());
            membership.setMembershipno(membershipDao.getNextMembershipNo());
            // do operation
            membershipDao.save(membership);


            // check dependencies

            return "OK";
        }catch (Exception e){
            return "Membership save not completed."+e.getMessage();
        }
    }

    // create post mapping for save or update membership record
    @PutMapping(value = "/membership/update")
    @Override
    public String updateData(@RequestBody Membership membership) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(),"New-Membership");
        if(!userPrivi.getPrivi_update()){
            return "Membership Update not completed : User haven't permission.";
        }
        // check existence
        // get id from object
        if(membership.getId()==null){
            return "Membership Update not completed : Membership not exist ..!";
        }

        // get id from database check this membership is existing
        Membership extmembership = membershipDao.getReferenceById(membership.getId());
        if(extmembership.getId()==null){
            return "Membership Update not completed : Membership not exist ..!";
        }
        // check duplicate for unique columns-- no unique columns
        // try operation
        try {
            // set auto generated values
            // set current datetime
            membership.setUpdateddatetime(LocalDateTime.now());

            // set Logged user id
            membership.setUpdateduserid(userDao.getByUsername(authentication.getName()).getId());

            // do operation
            membershipDao.save(membership);
            // check dependencies
            return "OK";
        }catch (Exception e){
            return "Membership update not completed."+e.getMessage();
        }
    }

    // create post mapping for save or delete membership record
    @DeleteMapping(value = "/membership/delete")
    @Override
    public String deleteData(@RequestBody Membership membership) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(),"New-Membership");
        if(!userPrivi.getPrivi_delete()){
            return "Membership Delete not completed : User haven't permission.";
        }

        // check membership exist
        // get id from object
        if(membership.getId()==null){
            return "Membership Delete not completed : Membership not exist ..!";
        }

        // get id from database check this membership is existing
        Membership extmembership = membershipDao.getReferenceById(membership.getId());
        if(extmembership.getId()==null){
            return "Membership Delete not completed : Membership not exist ..!";
        }
        try {
            // set auto generated values
            // set current datetime
            extmembership.setDeleteddatetime(LocalDateTime.now());

            // set Logged user id
            extmembership.setDeleteduserid(userDao.getByUsername(authentication.getName()).getId());

            // do not delete set status on to deleted
            extmembership.setMembershipstatus_id(membershipStatusDao.getReferenceById(9));
            membershipDao.save(extmembership);
            //membershipDao.delete(membership);

            //dependencies
            return "OK";
        }catch (Exception e){
            return "Membership delete not completed."+e.getMessage();
        }
    }

    @PutMapping(value = "/membership/updateasexpired")
    public String updateAsExpired(@RequestBody Membership membership) {
        //checked logged user has permission for update Book record (check user authentication and authorization)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"New-Membership");
        if(!userPrivi.getPrivi_update()){
            return "Membership updated as expired not completed : User haven't permission.";
        }
        // check existence
        if(membership.getId()==null){
            return "Membership updated as expired not completed : Record not exist.";
        }
        Membership extMembership=membershipDao.getReferenceById(membership.getId());
        if(extMembership.getId()==null){
            return "Membership updated as expired not completed : Record not exist.";
        }

        //check duplicate for unique columns
        // no unique columns

        try {
            // update status to expired
            membership.setMembershipstatus_id(membershipStatusDao.getReferenceById(6));

            //operation
            membershipDao.save(membership);
            return "OK";

        }catch (Exception e){
            return "Membership updated as expired not completed : " + e.getMessage();
        }
    }
}
