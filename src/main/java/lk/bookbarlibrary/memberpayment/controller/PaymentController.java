package lk.bookbarlibrary.memberpayment.controller;

import lk.bookbarlibrary.AuthController;
import lk.bookbarlibrary.borrow.dao.BorrowDao;
import lk.bookbarlibrary.borrow.entity.Borrow;
import lk.bookbarlibrary.memberpayment.dao.PaymentDao;
import lk.bookbarlibrary.memberpayment.dao.PaymentHasBorrowDao;
import lk.bookbarlibrary.memberpayment.entity.Payment;
import lk.bookbarlibrary.memberpayment.entity.PaymentHasBorrow;
import lk.bookbarlibrary.privilege.entity.Privilege;
import lk.bookbarlibrary.user.dao.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
public class PaymentController {

    @Autowired
    private PaymentDao paymentDao;

    @Autowired
    private AuthController authController;

    @Autowired
    private UserDao userDao;

    @Autowired
    private PaymentHasBorrowDao paymentHasBorrowDao;

    @Autowired
    private BorrowDao borrowDao;

    @RequestMapping(value="/payment")
	public ModelAndView paymentUI(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		ModelAndView paymentView = new ModelAndView();
        paymentView.addObject("loggedusername" , authentication.getName());
        paymentView.addObject("title", "Member Payment Management");
		paymentView.setViewName("payment.html");
		return paymentView;
	}
    @RequestMapping(value="/payment", params = "membershipid")
    public ModelAndView paymentFormByMembership(@RequestParam("membershipid")String membershipid){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView paymentView = new ModelAndView();
        paymentView.addObject("loggedusername" , authentication.getName());
        paymentView.addObject("title", "Payment Management");
        paymentView.setViewName("payment.html");
        return paymentView;
    }
    @RequestMapping(value="/payment", params = "borrowIds")
    public ModelAndView paymentFormByBorrowIds(@RequestParam("borrowIds") String borrowIds){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView paymentView = new ModelAndView();
        paymentView.addObject("loggedusername", authentication.getName());
        paymentView.addObject("title", "Payment Management");


        //paymentView.addObject("borrowIds", borrowIds);

        paymentView.setViewName("payment.html");
        return paymentView;
    }
    @RequestMapping(value="/payment/bymembershipid/{membershipid}")
    public Payment paymentByMembership(@PathVariable("membershipid")String membershipid){
        return paymentDao.getByMembership_id(membershipid);
    }

    // get mapping for get all payment data
    @GetMapping(value = "/payment/alldata")
    public List<Payment> getAllPayment(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi= authController.getPrivilegeByUserAndModule(authentication.getName(),"Payment");
        if(userPrivi.getPrivi_select()){
            return paymentDao.findAll();
        }else{
            return new ArrayList<>();
        }

    }


    // create get mapping for get payment object by given id(Path variable)
    @GetMapping(value = "/payment/byid/{paymentid}", produces = "application/json")
    public Payment getPaymentById(@PathVariable Integer paymentid){
        return paymentDao.getReferenceById(paymentid);
    }

    // create post mapping for save or insert payment record
    @PostMapping("/payment/insert")
    public String insertPayment(@RequestBody Payment payment){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi= authController.getPrivilegeByUserAndModule(authentication.getName(),"Payment");
        if(!userPrivi.getPrivi_insert()){
            return "Payment Save not completed : User haven't permission";
        }
        // check duplicate for unique columns
        Payment extPaymentByReferenceNo= paymentDao.getByReferenceno(payment.getReferenceno());
        if(extPaymentByReferenceNo != null){
            return "Payment Save not completed : Given Reference No "+ payment.getReferenceno()+" Reference No already exists";
        }

        // try operation
        try {
            payment.setAddeddatetime(LocalDateTime.now());
            payment.setAddeduserid(userDao.getByUsername(authentication.getName()).getId());
            payment.setPaymentno(paymentDao.getNextPaymentNo());

            //pyment type id == 2 fine payment
            if(payment.getPaymenttype_id() != null && payment.getPaymenttype_id().getId() == 2){

                // creates a new list
                List<PaymentHasBorrow> newList = new ArrayList<>();

                // if select 2 borrow records, process one at a time
                for(PaymentHasBorrow phb : payment.getPaymentHasBorrowList()){
                    Integer borrowId = phb.getBorrow_id().getId();

                    Borrow borrow= borrowDao.findById(borrowId).
                            orElseThrow(() -> new RuntimeException("Borrow not found: " + borrowId));
                    // orElseThrow - avoids working with invalid or missing data

                    // how much already paid
                    BigDecimal alreadyPaid= paymentHasBorrowDao.getTotalPaidByBorrow(borrowId);
                    if (alreadyPaid == null) {
                        alreadyPaid = BigDecimal.ZERO;
                    }

                    // get remaining
                    // BigDecimal gives precise decimal calculations
                    BigDecimal remaining = borrow.getFullfineamount().subtract(alreadyPaid);

                    // Create a new PaymentHasBorrow object
                    PaymentHasBorrow newPhb = new PaymentHasBorrow();

                    newPhb.setPayment_id(payment);
                    newPhb.setBorrow_id(borrow);
                    newPhb.setPaidamount(remaining);
                    newList.add(newPhb);
                }
                // Add to the list
                payment.setPaymentHasBorrowList(newList);
                // records are automatically saved - entity relationship , cascade
            }

            // do operator
            paymentDao.save(payment);


            // check dependencies
            return "OK";
        }catch (Exception e){
            return "Payment Save not completed : "+e.getMessage();
        }
    }

}
