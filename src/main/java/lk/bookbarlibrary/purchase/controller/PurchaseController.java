package lk.bookbarlibrary.purchase.controller;

import jakarta.transaction.Transactional;
import lk.bookbarlibrary.AuthController;
import lk.bookbarlibrary.CommonController;
import lk.bookbarlibrary.book.dao.BookDao;
import lk.bookbarlibrary.book.entity.Book;
import lk.bookbarlibrary.member.entity.Member;
import lk.bookbarlibrary.privilege.entity.Privilege;
import lk.bookbarlibrary.purchase.dao.PurchaseDao;
import lk.bookbarlibrary.purchase.dao.PurchaseStatusDao;
import lk.bookbarlibrary.purchase.entity.Purchase;
import lk.bookbarlibrary.purchase.entity.PurchaseHasBook;
import lk.bookbarlibrary.purchase.entity.PurchaseStatus;
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
public class PurchaseController implements CommonController<Purchase> {
    @Autowired
    private PurchaseDao purchaseDao;

    @Autowired
    private AuthController authController;

    @Autowired
    private UserDao userDao;

    @Autowired
    private PurchaseStatusDao purchaseStatusDao;

    @Autowired
    private BookDao bookDao;

    @Override
    @RequestMapping(value="/purchase")
    public ModelAndView getUi() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView purchaseView = new ModelAndView();
        purchaseView.addObject("loggedusername" , authentication.getName());
        purchaseView.addObject("title", "Purchase Order Management");
        purchaseView.setViewName("purchase.html");
        return purchaseView;
    }

    @Override
    @GetMapping(value = "/purchase/alldata" , produces = "application/json")
    public List<Purchase> findAllData() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi= authController.getPrivilegeByUserAndModule(authentication.getName(),"Purchase");
        if(userPrivi.getPrivi_select()){
            return purchaseDao.findAll();
        }else {
            return new ArrayList<>();
        }
    }

    // create mapping for get purchase object by using given id (path variable)
    @GetMapping(value = "/purchase/byid/{purchaseid}", produces = "application/json")
    public Purchase getPurchaseById(@PathVariable Integer purchaseid) {
        return purchaseDao.getReferenceById(purchaseid);
    }

    @GetMapping(value = "/purchase/bysupplier/{supplierid}", produces = "application/json")
    public List<Purchase> getPurchaseBySupplier(@PathVariable Integer supplierid) {
        return purchaseDao.getPurchaseListBySupplier(supplierid);
    }

    // this is important because saving and updating multiple tables in one business operation
    // all database operations inside the method are treated as a single transaction
    // must either all succeed or all fail together
    // If an error occurs in any operation, Spring rolls back the entire transaction
    // preventing partial updates
    // maintaining database consistency
    @Transactional
    @Override
    @PostMapping(value = "/purchase/insert")
    public String saveData(@RequestBody Purchase purchase) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi= authController.getPrivilegeByUserAndModule(authentication.getName(),"Purchase");
        if(! userPrivi.getPrivi_insert()){
            return "Purchase Order save not completed : User haven't permission.";
        }
        try{
            // check dependencies

            // set added date time
            purchase.setAddeddatetime(LocalDateTime.now());
            // set user id
            purchase.setAddeduserid(userDao.getByUsername(authentication.getName()).getId());

            //set code
            purchase.setPurchaseordercode(purchaseDao.getNextCodeNo());

            for(PurchaseHasBook phb : purchase.getPurchaseHasBookList()){
                phb.setPurchase_id(purchase);

                BigDecimal purchasePrice = phb.getPurchaseprice();
                Book book= bookDao.getReferenceById(phb.getBook_id().getId());
                BigDecimal initialPrice = book.getInitialprice();
                //a.compareTo(b)
                // < 0 → a < b
                // 0 → a == b
                // > 0 → a > b
                if(initialPrice.compareTo(purchasePrice) <= 0){
                    book.setUpdatedprice(purchasePrice);
                }
                bookDao.save(book);
            }
            // operator
            purchaseDao.save(purchase);
            return "OK";
        }catch(Exception e){
            return "Purchase Order insert not completed. " + e.getMessage();
        }
    }

    @Override
    @PutMapping(value = "/purchase/update")
    public String updateData(@RequestBody  Purchase purchase) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi= authController.getPrivilegeByUserAndModule(authentication.getName(),"Purchase");
        if(! userPrivi.getPrivi_update()){
            return "Purchase Order update not completed : User haven't permission.";
        }
        // check existence
        // get id from object
        if(purchase.getId()==null){
            return "Purchase Order update not completed : Purchase Order not exist..!";
        }

        // get id from database check this purchase order is existing
        Purchase extPurchase = purchaseDao.getReferenceById(purchase.getId());
        if(extPurchase.getId()==null){
            return "Purchase Order update not completed : Purchase Order not exist..!";
        }
        try{
            // check dependencies

            // set updated date time
            purchase.setUpdateddatetime(LocalDateTime.now());
            // set user id
            purchase.setUpdateduserid(userDao.getByUsername(authentication.getName()).getId());

            for(PurchaseHasBook phb : purchase.getPurchaseHasBookList()){
                phb.setPurchase_id(purchase);
            }
            // operator
            purchaseDao.save(purchase);

            return "OK";
        }catch(Exception e){
            return "Purchase Order update not completed. " + e.getMessage();
        }

    }

    @Override
    @DeleteMapping(value = "/purchase/delete")
    public String deleteData(@RequestBody  Purchase purchase) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi= authController.getPrivilegeByUserAndModule(authentication.getName(),"Purchase");
        if(! userPrivi.getPrivi_delete()){
            return "Purchase Order Delete not completed : User haven't permission.";
        }

        // check existence
        // get id from object
        if(purchase.getId()==null){
            return "Purchase Order delete not completed : Purchase Order not exist..!";
        }

        // get id from database check this purchase order is existing
        Purchase extPurchase = purchaseDao.getReferenceById(purchase.getId());
        if(extPurchase.getId()==null){
            return "Purchase Order delete not completed : Purchase Order not exist..!";
        }

        try{
            // check dependencies

            // set deleted date time
            extPurchase.setDeleteddatetime(LocalDateTime.now());
            // set user id
            extPurchase.setDeleteduserid(userDao.getByUsername(authentication.getName()).getId());

            // change status
            extPurchase.setPurchasestatus_id(purchaseStatusDao.getReferenceById(4));
            // operator
            purchaseDao.save(extPurchase);

            return "OK";
        }catch(Exception e){
            return "Purchase Order Delete not completed. " + e.getMessage();
        }
    }
}
