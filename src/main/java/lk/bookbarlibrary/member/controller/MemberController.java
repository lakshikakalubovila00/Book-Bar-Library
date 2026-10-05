package lk.bookbarlibrary.member.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lk.bookbarlibrary.AuthController;
import lk.bookbarlibrary.guarantor.dao.GuarantorDao;
import lk.bookbarlibrary.guarantor.entity.Guarantor;
import lk.bookbarlibrary.member.dao.MemberStatusDao;
import lk.bookbarlibrary.privilege.entity.Privilege;
import lk.bookbarlibrary.user.dao.UserDao;
import lk.bookbarlibrary.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import lk.bookbarlibrary.CommonController;
import lk.bookbarlibrary.member.dao.MemberDao;
import lk.bookbarlibrary.member.entity.Member;

@RestController
public class MemberController implements CommonController<Member> {

	@Autowired
	private MemberDao memberDao;

    @Autowired
    private GuarantorDao guarantorDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private AuthController authController;

    @Autowired
    private MemberStatusDao memberStatusDao;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
	@RequestMapping(value = "/member")
	public ModelAndView getUi() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		ModelAndView memberView = new ModelAndView();
        memberView.addObject("loggedusername" , authentication.getName());
        memberView.addObject("title", "Member Management");
		memberView.setViewName("member.html");
		return memberView;

	}
    // create mapping for get member object by using given id (path variable)
    @GetMapping(value = "/member/byid/{memberid}", produces = "application/json")
    public Member getMemberById(@PathVariable Integer memberid) {
        return memberDao.getReferenceById(memberid);
    }

	@Override
	@RequestMapping(value = "/member/alldata", produces = "application/json")
	public List<Member> findAllData() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(), "Member");
        if (userPrivi.getPrivi_select()){
            return memberDao.findAll();
        }else {
            return new ArrayList<>();
        }
	}

    // get member by member no
    @GetMapping(value = "/member/bymemberno/{memberno}", produces = "application/json")
    public Member getMemberByMemberno(@PathVariable String memberno) {
        return memberDao.filterByMemberno(memberno);
    }

    @GetMapping(value = "/members/count", produces = "application/json")
    public int getMembersCount() {
        return memberDao.getMembersCount();
    }

	@Override
	@PostMapping(value = "/member/insert")
	public String saveData(@RequestBody Member member) {
        //checked loged user has permission for insert book record (check user authentication and authorization)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Member");
        if(!userPrivi.getPrivi_insert()){
            return "Member save not completed : User haven't permission.";
        }
        //check duplicate for unique columns

			// check duplicate nic
			Member extMemberByNic = memberDao.getByNic(member.getNic());
			if (extMemberByNic != null) {
				return "Member Save not completed : Given Nic " + member.getNic() + "Nic already exists";
			}
			// check duplicate email
            Member extMemberByEmail= memberDao.getByEmail(member.getEmail());
            if (extMemberByEmail != null) {
                return "Member Save not completed : Given Email " + member.getEmail() + "Email already exists";
            }

			// check duplicate mobile no
             Member extMemberByMobileNo= memberDao.getByMobileno(member.getMobileno());
            if (extMemberByMobileNo != null) {
                return "Member Save not completed : Given Mobile No " + member.getMobileno() + "Mobile No already exists";
            }

			// try operation
			try {
				// set auto generated value
				// set added date time
				member.setAddeddatetime(LocalDateTime.now()); // set current datetime

				// set added user id
                User loggeduser = userDao.getByUsername(authentication.getName());
				member.setAddeduserid(loggeduser.getId()); // set Logged user id
				// set member no
				member.setMemberno(memberDao.getNextMemberNo());

                //set user details
                member.setUsername(member.getMemberno());
                // child - DOB
                // Adult - NIC
                if(member.getMembertype().equals("Child")){
                    // Child
                    member.setPassword(bCryptPasswordEncoder.encode(member.getDob().toString()));
                }else{
                    // Adult
                    member.setPassword(bCryptPasswordEncoder.encode(member.getNic()));
                }
                // set this to false when adding member.
                // set to true after getting assign to the membership
                member.setAccountstatus(Boolean.FALSE);
                // do operation
				memberDao.save(member);
                System.out.println("Saved Member: " + member);


				// check dependencies
				return "OK";
			} catch (Exception e) {
				return "Member insert not completed. " + e.getMessage();
			}
	}

	@Override
	@PutMapping(value="/member/update")
	public String updateData(@RequestBody Member member) {

        //checked loged user has permission for update member record (check user authentication and authorization)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Member");
		if(!userPrivi.getPrivi_update()){
            return "Member Update not completed : User haven't permission.";
        }

			// check existence
			if(member.getId()==null){
				return "Member Update not completed , Member not already Exist..!";
			}
			Member extMember= memberDao.getReferenceById(member.getId());
			if (extMember.getId()==null) {
				return "Member Update not completed , Member not already Exist..!";
			}

			// check duplicate for unique columns

			// duplicate nic
			Member extMemberByNic = memberDao.getByNic(member.getNic());
			if (extMemberByNic != null && extMemberByNic.getId()!=extMember.getId()) {
				return "Member Update not completed : Given Nic " + member.getNic() + "Nic already Exist..!";
			}

			// duplicate email
        Member extMemberByEmail= memberDao.getByEmail(member.getEmail());
            if (extMemberByEmail != null && extMemberByEmail.getId()!=extMember.getId()) {
                return "Member Update not completed : Given Email " + member.getEmail() + "Email already Exist..!";
            }

			// duplicate mobile
        Member extMemberByMobileNo= memberDao.getByMobileno(member.getMobileno());
            if (extMemberByMobileNo != null && extMemberByMobileNo.getId()!=extMember.getId()) {
                return "Member Update not completed : Given Mobile No " + member.getMobileno() + "Mobile No already Exist..!";
            }

			// try operation
			try {
				// set auto generated values

				member.setUpdateddatetime(LocalDateTime.now());
                User loggeduser = userDao.getByUsername(authentication.getName());
				member.setUpdateduserid(loggeduser.getId());

				// do operation

				memberDao.save(member);

				// check dependencies

				return "OK";

			} catch (Exception e) {
				return "Member Update not completed. "+e.getMessage();
			}
	}

	@Override
	@DeleteMapping(value="/member/delete")
	public String deleteData(@RequestBody Member member) {
        //checked loged user has permission for update member record (check user authentication and authorization)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Member");
        if(!userPrivi.getPrivi_delete()){
            return "Member Delete not completed : User haven't permission.";
        }

			// check existence
			if(member.getId()==null){
				return "Member Delete not completed , Member not already Exist..!";
			}
			Member extMember= memberDao.getReferenceById(member.getId());
			if (extMember.getId()==null) {
				return "Member Delete not completed , Member not already Exist..!";
			}

			//try operation
			try {
				//set auto generated value
				extMember.setDeleteddatetime(LocalDateTime.now());

                User loggeduser = userDao.getByUsername(authentication.getName());
				extMember.setDeleteduserid(loggeduser.getId());
				// update status
                extMember.setMemberstatus_id(memberStatusDao.getReferenceById(5));

				// operation
				//memberDao.delete(member);
				memberDao.save(extMember);

                return "OK";

			} catch (Exception e) {
                return "Member Delete not completed. " + e.getMessage();
			}
    }

}
