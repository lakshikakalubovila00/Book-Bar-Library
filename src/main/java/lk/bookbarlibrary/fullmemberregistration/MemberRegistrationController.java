package lk.bookbarlibrary.fullmemberregistration;

import lk.bookbarlibrary.AuthController;
import lk.bookbarlibrary.guarantor.dao.GuarantorDao;
import lk.bookbarlibrary.guarantor.entity.Guarantor;
import lk.bookbarlibrary.member.dao.MemberDao;
import lk.bookbarlibrary.member.entity.Member;
import lk.bookbarlibrary.membership.dao.MembershipDao;
import lk.bookbarlibrary.membership.entity.Membership;
import lk.bookbarlibrary.memberpayment.dao.PaymentDao;
import lk.bookbarlibrary.memberpayment.entity.Payment;
import lk.bookbarlibrary.privilege.entity.Privilege;
import lk.bookbarlibrary.user.dao.UserDao;
import lk.bookbarlibrary.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDate;
import java.time.LocalDateTime;

@RestController
public class MemberRegistrationController {
    @Autowired
    private PaymentDao paymentDao;

    @Autowired
    private AuthController authController;

    @Autowired
    private UserDao userDao;

    @Autowired
    private MemberDao memberDao;

    @Autowired
    private GuarantorDao guarantorDao;

    @Autowired
    private MembershipDao membershipDao;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @RequestMapping(value = "/memberregistration")
    public ModelAndView memberregistrationUi(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView memberregistrationView = new ModelAndView();
        memberregistrationView.addObject("loggedusername" , authentication.getName());
        memberregistrationView.addObject("title", "Member Registration");
        memberregistrationView.setViewName("memberregistration.html");
        return memberregistrationView;
    }
    @PostMapping(value = "/memberregistration/insert")
    public String insertPayment(@RequestBody Payment payment){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi= authController.getPrivilegeByUserAndModule(authentication.getName(),"Member-Registration");
        if(!userPrivi.getPrivi_insert()){
            return "Member Registration Save not completed : User haven't permission";
        }
        // check duplicate for unique columns

        // try operation
        try {
            Member member= new Member();

            if(payment.getMember_id().getId()==null){
                if(payment.getMember_id().getGuarantor_id().getId()==null){
                    // check duplicate nic
                    Guarantor extGuarantorByNic = guarantorDao.getByNic(payment.getMember_id().getGuarantor_id().getNic());
                    if (extGuarantorByNic != null) {
                        return "Guarantor Save not completed : Given Nic " + payment.getMember_id().getGuarantor_id().getNic() + "Nic already exists";
                    }
                    // duplicate email
                    Guarantor extGuarantorByEmail=guarantorDao.getByEmail(payment.getMember_id().getGuarantor_id().getEmail());
                    if (extGuarantorByEmail != null) {
                        return "Guarantor Save not completed : Given Email " + payment.getMember_id().getGuarantor_id().getEmail() + "Email already exists";
                    }
                    // check duplicate mobile no
                    Guarantor extGuarantorByMobileNo = guarantorDao.getByMobileno(payment.getMember_id().getGuarantor_id().getMobileno());
                    if (extGuarantorByMobileNo != null) {
                        return "Guarantor Save not completed : Given Mobile No " + payment.getMember_id().getGuarantor_id().getMobileno() + "Mobile No already exists";
                    }

                    payment.getMember_id().getGuarantor_id().setAddeddatetime(LocalDate.now()); // set current datetime

                    // set added user id

                    User loggeduser = userDao.getByUsername(authentication.getName());
                    payment.getMember_id().getGuarantor_id().setAddeduserid(loggeduser.getId()); // set Logged user id

                    Guarantor guarantor = guarantorDao.save(payment.getMember_id().getGuarantor_id());
                    payment.getMember_id().setGuarantor_id(guarantor);
                }
                // check duplicate nic
                Member extMemberByNic = memberDao.getByNic(payment.getMember_id().getNic());
                if (extMemberByNic != null) {
                    return "Member Save not completed : Given Nic " + payment.getMember_id().getNic() + "Nic already exists";
                }
                // check duplicate email
                Member extMemberByEmail= memberDao.getByEmail(payment.getMember_id().getEmail());
                if (extMemberByEmail != null) {
                    return "Member Save not completed : Given Email " + payment.getMember_id().getEmail() + "Email already exists";
                }

                // check duplicate mobile no
                Member extMemberByMobileNo= memberDao.getByMobileno(payment.getMember_id().getMobileno());
                if (extMemberByMobileNo != null) {
                    return "Member Save not completed : Given Mobile No " + payment.getMember_id().getMobileno() + "Mobile No already exists";
                }
                payment.getMember_id().setAddeddatetime(LocalDateTime.now()); // set current datetime

                // set added user id
                User loggeduser = userDao.getByUsername(authentication.getName());
                payment.getMember_id().setAddeduserid(loggeduser.getId()); // set Logged user id
                // set member no
                payment.getMember_id().setMemberno(memberDao.getNextMemberNo());
                //set user details
                payment.getMember_id().setUsername(payment.getMember_id().getMemberno());
                // child - DOB
                // Adult - NIC
                if(payment.getMember_id().getMembertype().equals("Child")){
                    // Child
                    payment.getMember_id().setPassword(bCryptPasswordEncoder.encode(payment.getMember_id().getDob().toString()));
                }else{
                    // Adult
                    payment.getMember_id().setPassword(bCryptPasswordEncoder.encode(payment.getMember_id().getNic()));
                }
                payment.getMember_id().setAccountstatus(Boolean.TRUE);
                 member= memberDao.save(payment.getMember_id());
                payment.setMember_id(member);

            }
            if(payment.getMembership_id().getId()==null){
                payment.getMembership_id().setAddeddatetime(LocalDateTime.now());

                // set Logged user id
                payment.getMembership_id().setAddeduserid(userDao.getByUsername(authentication.getName()).getId());
                payment.getMembership_id().setMembershipno(membershipDao.getNextMembershipNo());
                payment.getMembership_id().setMember_id(member);
                Membership membership = membershipDao.save(payment.getMembership_id());
                payment.setMembership_id(membership);
            }

            // check duplicate for unique columns
            Payment extPaymentByReferenceNo= paymentDao.getByReferenceno(payment.getReferenceno());
            if(extPaymentByReferenceNo != null){
                return "Payment Save not completed : Given Reference No "+ payment.getReferenceno()+" Reference No already exists";
            }
            payment.setAddeddatetime(LocalDateTime.now());
            payment.setAddeduserid(userDao.getByUsername(authentication.getName()).getId());
            payment.setPaymentno(paymentDao.getNextPaymentNo());

            // do operator
            paymentDao.save(payment);
            System.out.println(payment);
            // check dependencies
            return "OK";

        }catch (Exception e){
            return "Payment Save not completed : "+e.getMessage();
        }
    }
}
