package lk.bookbarlibrary.supplierpayment.controller;

import lk.bookbarlibrary.AuthController;
import lk.bookbarlibrary.grn.dao.GRNDao;
import lk.bookbarlibrary.grn.dao.GRNStatusDao;
import lk.bookbarlibrary.grn.entity.GRN;
import lk.bookbarlibrary.memberpayment.entity.Payment;
import lk.bookbarlibrary.memberpayment.entity.PaymentHasBorrow;
import lk.bookbarlibrary.privilege.entity.Privilege;
import lk.bookbarlibrary.purchase.dao.PurchaseDao;
import lk.bookbarlibrary.purchase.dao.PurchaseStatusDao;
import lk.bookbarlibrary.purchase.entity.Purchase;
import lk.bookbarlibrary.supplierpayment.dao.SupplierPaymentDao;
import lk.bookbarlibrary.supplierpayment.entity.SupplierPayment;
import lk.bookbarlibrary.supplierpayment.entity.SupplierPaymentHasGRN;
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
public class SupplierPaymentController {
    @Autowired
    private SupplierPaymentDao supplierPaymentDao;

    @Autowired
    private AuthController authController;

    @Autowired
    private UserDao userDao;

    @Autowired
    private GRNDao gRNDao;

    @Autowired
    private GRNStatusDao grnStatusDao;

    @Autowired
    private PurchaseDao purchaseDao;

    @Autowired
    private PurchaseStatusDao purchaseStatusDao;


    @RequestMapping(value="/supplierpayment")
    public ModelAndView getUi() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView supplierPaymentView = new ModelAndView();
        supplierPaymentView.addObject("loggedusername", authentication.getName());
        supplierPaymentView.addObject("title", "Supplier Payment Management");
        supplierPaymentView.setViewName("supplierpayment.html");
        return supplierPaymentView;
    }


    // get mapping for get all payment data
    @GetMapping(value = "/supplierpayment/alldata")
    public List<SupplierPayment> getAllPayment(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi= authController.getPrivilegeByUserAndModule(authentication.getName(),"Supplier-Payment");
        if(userPrivi.getPrivi_select()){
            return supplierPaymentDao.findAll();
        }else{
            return new ArrayList<>();
        }
    }


    // create get mapping for get payment object by given id(Path variable)
    @GetMapping(value = "/supplierpayment/byid/{paymentid}", produces = "application/json")
    public SupplierPayment getPaymentById(@PathVariable Integer paymentid){
        return supplierPaymentDao.getReferenceById(paymentid);
    }

    // create post mapping for save or insert payment record
    @PostMapping("/supplierpayment/insert")
    public String insertPayment(@RequestBody SupplierPayment supplierPayment){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi= authController.getPrivilegeByUserAndModule(authentication.getName(),"Supplier-Payment");
        if(!userPrivi.getPrivi_insert()){
            return "Supplier Payment Save not completed : User haven't permission";
        }
        // check duplicate for unique columns
        // cheque no
        // transfer no

        // try operation
        try {
            supplierPayment.setAddeddatetime(LocalDateTime.now());
            supplierPayment.setAddeduserid(userDao.getByUsername(authentication.getName()).getId());
            supplierPayment.setPaymentno(supplierPaymentDao.getNextPaymentNo());

            for(SupplierPaymentHasGRN sphgrn : supplierPayment.getSupplierPaymentHasGRNList()){
                sphgrn.setSupplierpayment_id(supplierPayment);

                GRN grn = gRNDao.getReferenceById(sphgrn.getGrn_id().getId());

                BigDecimal balance= sphgrn.getNewbalance();
                grn.setBalance(balance);

                if(balance.compareTo(BigDecimal.ZERO)==0){
                    // if fully paid == Fully completed
                    grn.setGrnstatus_id(grnStatusDao.getReferenceById(3));
                    // purchase status into received
                    Purchase purchase = purchaseDao.getReferenceById(grn.getPurchase_id().getId());
                    purchase.setPurchasestatus_id(purchaseStatusDao.getReferenceById(3));
                    purchaseDao.save(purchase);
                }else{
                    // if not fully paid grn amount=  partially completed
                    grn.setGrnstatus_id(grnStatusDao.getReferenceById(2));
                }
                gRNDao.save(grn);
            }

            // do operator
            supplierPaymentDao.save(supplierPayment);

            // check dependencies
            return "OK";
        }catch (Exception e){
            return "Supplier Payment Save not completed : "+e.getMessage();
        }
    }
}
