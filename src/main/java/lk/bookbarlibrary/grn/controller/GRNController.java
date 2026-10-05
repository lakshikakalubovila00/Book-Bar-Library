package lk.bookbarlibrary.grn.controller;

import jakarta.transaction.Transactional;
import lk.bookbarlibrary.AuthController;
import lk.bookbarlibrary.CommonController;
import lk.bookbarlibrary.book.dao.*;
import lk.bookbarlibrary.book.entity.Book;
import lk.bookbarlibrary.book.entity.BookCopy;
import lk.bookbarlibrary.grn.dao.GRNDao;
import lk.bookbarlibrary.grn.dao.GRNStatusDao;
import lk.bookbarlibrary.grn.entity.GRN;
import lk.bookbarlibrary.grn.entity.GRNHasBook;
import lk.bookbarlibrary.privilege.entity.Privilege;
import lk.bookbarlibrary.purchase.dao.PurchaseDao;
import lk.bookbarlibrary.purchase.dao.PurchaseStatusDao;
import lk.bookbarlibrary.purchase.entity.Purchase;
import lk.bookbarlibrary.user.dao.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
public class GRNController implements CommonController<GRN> {
    @Autowired
    private GRNDao grnDao;

    @Autowired
    private AuthController authController;

    @Autowired
    private UserDao userDao;

    @Autowired
    private GRNStatusDao grnStatusDao;

    @Autowired
    private BookCopyDao bookCopyDao;

    @Autowired
    private AcquisitionMethodDao acquisitionMethodDao;

    @Autowired
    private BookCopyStatusDao bookCopyStatusDao;

    @Autowired
    private DamageStatusDao damageStatusDao;

    @Autowired
    private BookStatusDao bookStatusDao;

    @Autowired
    private BookDao bookDao;

    @Autowired
    private PurchaseStatusDao  purchaseStatusDao;

    @Autowired
    private PurchaseDao purchaseDao;

    @Override
    @RequestMapping(value="/grn")
    public ModelAndView getUi() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView grnView = new ModelAndView();
        grnView.addObject("loggedusername", authentication.getName());
        grnView.addObject("title", "Good Receive Note");
        grnView.setViewName("grn.html");
        return grnView;
    }

    @Override
    @GetMapping(value = "/grn/alldata" , produces = "application/json")
    public List<GRN> findAllData() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi= authController.getPrivilegeByUserAndModule(authentication.getName(),"Good-Receive-Note");
        if(userPrivi.getPrivi_select()){
            return grnDao.findAll();
        }else {
            return new ArrayList<>();
        }
    }

    @GetMapping(value = "/grn/byid/{grnid}", produces = "application/json")
    public GRN getGRNById(@PathVariable Integer grnid) {
        return grnDao.getReferenceById(grnid);
    }

    @GetMapping(value = "/grn/bysupplier/{supplierid}", produces = "application/json")
    public List<GRN> getGRNBySupplier(@PathVariable Integer supplierid) {
        return grnDao.getGRNListBySupplier(supplierid);
    }

    // this is important because saving and updating multiple tables in one business operation
    // all database operations inside the method are treated as a single transaction
    // must either all succeed or all fail together
    // If an error occurs in any operation, Spring rolls back the entire transaction
    // preventing partial updates
    // maintaining database consistency
    @Transactional
    @Override
    @PostMapping(value = "/grn/insert")
    public String saveData(@RequestBody GRN grn) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi= authController.getPrivilegeByUserAndModule(authentication.getName(),"Good-Receive-Note");
        if(!userPrivi.getPrivi_insert()){
            return "GRN save not completed : User haven't permission.";
        }
        try{
            // check dependencies

            // set added date time
            grn.setAddeddatetime(LocalDateTime.now());
            // set user id
            grn.setAddeduserid(userDao.getByUsername(authentication.getName()).getId());
            // set grn no
            grn.setGrnno(grnDao.getNextGRNNo());

            // set balance
            BigDecimal totalamount= grn.getTotalamount();
            grn.setBalance(totalamount);

            Purchase purchase = purchaseDao.getReferenceById(grn.getPurchase_id().getId());
            purchase.setPurchasestatus_id(purchaseStatusDao.getReferenceById(2));
            purchaseDao.save(purchase);

            for(GRNHasBook grnhb : grn.getGrnHasBookList()){
                grnhb.setGrn_id(grn);
                // get received quantity
                Integer receivedQuantity = grnhb.getReceivedquantity();
                Book book= bookDao.getReferenceById(grnhb.getBook_id().getId());
                book.setBookstatus_id(bookStatusDao.getReferenceById(1));

                BigDecimal unitPrice = grnhb.getUnitprice();
                BigDecimal initialPrice = book.getInitialprice();
                //a.compareTo(b)
                // < 0 → a < b
                // 0 → a == b
                // > 0 → a > b
                if(initialPrice.compareTo(unitPrice) <= 0){
                    book.setUpdatedprice(unitPrice);
                }

                bookDao.save(book);

                for(int i=0; i<receivedQuantity; i++){
                    BookCopy bookCopy = new BookCopy();

                    // set book id
                    bookCopy.setBook_id(book);

                    // generate copy no
                    String copyNo=bookCopyDao.getNextBookCopyNo(book.getId());
                    bookCopy.setCopyno(copyNo);

                    // generate accession no
                    String accessionNo= book.getBookno()+ copyNo;
                    bookCopy.setAccessionno(accessionNo);

                    // printed year

                    // set book copy status
                    if(book.getResourcetype_id().getId()==5){
                        bookCopy.setBookcopystatus_id(bookCopyStatusDao.getReferenceById(3));
                    }else{
                        bookCopy.setBookcopystatus_id(bookCopyStatusDao.getReferenceById(1));
                    }

                    // set is reserved false
                    bookCopy.setIsreserved(false);

                    // set damage status
                    bookCopy.setDamagestatus_id(damageStatusDao.getReferenceById(1));

                    // acquisition method
                    bookCopy.setAcquisitionmethod_id(acquisitionMethodDao.getReferenceById(1));

                    // acquisition date
                    bookCopy.setAcquisitiondate(LocalDate.now());

                    //set price
                    //bookCopy.setPrice(grnhb.getUnitprice().toPlainString());

                    // location
                    bookCopy.setAddeddatetime(LocalDateTime.now());
                    bookCopy.setAddeduserid(userDao.getByUsername(authentication.getName()).getId());

                    bookCopyDao.save(bookCopy);
                }
            }
            // operator
            grnDao.save(grn);
            return "OK";
        }catch(Exception e){
            return "GRN insert not completed. "+e.getMessage();
        }
    }

    @Override
    @PutMapping(value = "/grn/update")
    public String updateData(@RequestBody GRN grn) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi= authController.getPrivilegeByUserAndModule(authentication.getName(),"Good-Receive-Note");
        if(!userPrivi.getPrivi_update()){
            return "GRN update not completed : User haven't permission.";
        }
        // check existence
        // get id from object
        if(grn.getId()==null){
            return "GRN update not completed : GRN not exist..!";
        }
        // get id from database check this record is existing
        GRN extGRN= grnDao.getReferenceById(grn.getId());
        if(extGRN.getId()==null){
            return "GRN update not completed : GRN not exist..!";
        }
        try {
            // check dependencies

            // set updated date time
            grn.setUpdateddatetime(LocalDateTime.now());
            // set user id
            grn.setUpdateduserid(userDao.getByUsername(authentication.getName()).getId());

            for(GRNHasBook grnhb : grn.getGrnHasBookList()){
                grnhb.setGrn_id(grn);
            }
            // operator
            grnDao.save(grn);
            return "OK";
        }catch(Exception e){
            return "GRN update not completed. "+e.getMessage();
        }
    }

    @Override
    @DeleteMapping(value = "/grn/delete")
    public String deleteData(@RequestBody GRN grn) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi= authController.getPrivilegeByUserAndModule(authentication.getName(),"Good-Receive-Note");
        if(!userPrivi.getPrivi_delete()){
            return "GRN Delete not completed : User haven't permission.";
        }
        // check existence
        // get id from object
        if(grn.getId()==null){
            return "GRN Delete not completed : GRN not exist..!";
        }
        // get id from database check this record is existing
        GRN extGRN= grnDao.getReferenceById(grn.getId());
        if(extGRN.getId()==null){
            return "GRN Delete not completed : GRN not exist..!";
        }
        try {
            // check dependencies

            // set deleted date time
            extGRN.setDeleteddatetime(LocalDateTime.now());
            // set user id
            extGRN.setDeleteduserid(userDao.getByUsername(authentication.getName()).getId());
            // change status
            extGRN.setGrnstatus_id(grnStatusDao.getReferenceById(5));
            // operator
            grnDao.save(extGRN);

            return "OK";
        }catch(Exception e){
            return "GRN delete not completed. "+e.getMessage();
        }

    }
}
