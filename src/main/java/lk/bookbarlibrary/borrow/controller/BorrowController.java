package lk.bookbarlibrary.borrow.controller;

import lk.bookbarlibrary.AuthController;
import lk.bookbarlibrary.CommonController;
import lk.bookbarlibrary.book.dao.BookCopyDao;
import lk.bookbarlibrary.book.dao.BookCopyStatusDao;
import lk.bookbarlibrary.book.entity.BookCopy;
import lk.bookbarlibrary.borrow.dao.BorrowDao;
import lk.bookbarlibrary.borrow.dao.BorrowHasBookCopyDao;
import lk.bookbarlibrary.borrow.dao.BorrowHasBookCopyStatusDao;
import lk.bookbarlibrary.borrow.dao.BorrowStatusDao;
import lk.bookbarlibrary.borrow.entity.Borrow;
import lk.bookbarlibrary.borrow.entity.BorrowHasBookCopy;
import lk.bookbarlibrary.memberpayment.dao.PaymentHasBorrowDao;
import lk.bookbarlibrary.privilege.entity.Privilege;
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
public class BorrowController implements CommonController<Borrow> {

    @Autowired
    private BorrowDao borrowDao;

    @Autowired
    private AuthController authController;

    @Autowired
    private UserDao userDao;

    @Autowired
    private BorrowHasBookCopyStatusDao borrowHasBookCopyStatusDao;

    @Autowired
    private BorrowHasBookCopyDao borrowHasBookCopyDao;

    @Autowired
    private BookCopyDao bookCopyDao;

    @Autowired
    private BookCopyStatusDao bookCopyStatusDao;

    @Autowired
    private BorrowStatusDao borrowStatusDao;

    @Autowired
    private PaymentHasBorrowDao paymentHasBorrowDao;

    @Override
    @RequestMapping(value="/borrow")
    public ModelAndView getUi() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView borrowView = new ModelAndView();
        borrowView.addObject("loggedusername" , authentication.getName());
        borrowView.addObject("title" , "Book Borrow Management");
        borrowView.setViewName("borrow.html");
        return borrowView;
    }


    @RequestMapping(value="/borrow/bymemberid/{memberid}")
    public List<Borrow> borrowByMember(@PathVariable Integer memberid){
        return borrowDao.getByMember_id(memberid);
    }

@RequestMapping("/borrow/byids")
public List<Borrow> getBorrows(@RequestParam List<Integer> ids){
    return borrowDao.findAllById(ids);
}
//    @GetMapping(value = "/payment/byborrowids/{borrowIds}")
//    public List<Borrow> getBorrowsByIds(@PathVariable List<Integer> borrowIds){
//        return borrowDao.findAllById(borrowIds);
//    }

    @GetMapping(value = "/payment/byborrowids")
    // request param gets data from the URL query parameters
    public List<Borrow> getBorrowsByIds(@RequestParam("borrowIds") List<Integer> borrowIds){
        List<Borrow> borrows = borrowDao.findAllById(borrowIds);
        // loop Through Each Borrow
        for (Borrow borrow : borrows) {

            // Calculate Already Paid Fine
            BigDecimal alreadyPaid = paymentHasBorrowDao.getTotalPaidByBorrow(borrow.getId());

            //Check for Null
            if (alreadyPaid == null) {
                alreadyPaid = BigDecimal.ZERO;
            }

            // Calculate Remaining Fine
            BigDecimal remaining = borrow.getFullfineamount().subtract(alreadyPaid);

            // Prevent negative values
            // < 0 - less than zero
            // 0 - equal to zero
            // > 0 - greater than zero
            if (remaining.compareTo(BigDecimal.ZERO) < 0) {
                remaining = BigDecimal.ZERO;
            }

            // @Transient field - not stored in the database
            borrow.setRemainingfine(remaining);
        }
        return borrows;
    }

    // create mapping for get borrow object by using given id (path variable)
    @GetMapping(value = "/borrow/byid/{borrowid}", produces = "application/json")
    public Borrow getBorrowById(@PathVariable Integer borrowid) {
        return borrowDao.getReferenceById(borrowid);
    }

    @GetMapping(value = "/borrow/booksonhand/{memberid}")
    public Integer getBooksOnHand(@PathVariable Integer memberid){
        return borrowDao.getBooksOnHandByMember(memberid);
    }

    @GetMapping(value = "/borrow/borrowedbooks/{memberid}", produces = "application/json")
    public List<BorrowHasBookCopy> getBorrowedBooks(@PathVariable Integer memberid){
        return borrowHasBookCopyDao.getBorrowedBookCopiesByMember(memberid);
    }

    @GetMapping(value = "/borrow/borrowedonlybooks/{memberid}", produces = "application/json")
    public List<BorrowHasBookCopy> getBorrowedOnlyBooks(@PathVariable Integer memberid){
        return borrowHasBookCopyDao.getBorrowedOnlyBookCopiesByMember(memberid);
    }
    @GetMapping(value = "/borrow/handoveredbooks/{memberid}", produces = "application/json")
    public List<BorrowHasBookCopy> getHandoveredBooks(@PathVariable Integer memberid){
        return borrowHasBookCopyDao.getHandoveredBookCopiesByMember(memberid);
    }

    @GetMapping(value = "/borrow/borrowedbooksbyborrowcode/{borrowcode}", produces = "application/json")
    public List<BorrowHasBookCopy> getBorrowedBooksCopiesByBorrowcode(@PathVariable String borrowcode){
        return borrowHasBookCopyDao.getBorrowedBookCopiesByBorrowcode(borrowcode);
    }

    @Override
    @GetMapping(value = "/borrow/alldata")
    public List<Borrow> findAllData() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(), "Book-Borrowing");
        if(userPrivi.getPrivi_select()){
            return borrowDao.findAll();
        }else {
            return new ArrayList<>();
        }
    }

    @Override
    @PostMapping(value = "/borrow/insert")
    public String saveData(@RequestBody Borrow borrow) {
        //checked loged user has permission for insert borrow record (check user authentication and authorization)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Book-Borrowing");
        if(!userPrivi.getPrivi_insert()){
            return "Borrow Record Save not completed : User haven't permission.";
        }
        try{
            //set auto generated values

            // srt borrow date
            borrow.setBorrowdate(LocalDate.now());

            // set added date time
            borrow.setAddeddatetime(LocalDateTime.now());

            // set added user id
            borrow.setAddeduserid(userDao.getByUsername(authentication.getName()).getId());
            // add borrowing list for borrow has book copy table
            for(BorrowHasBookCopy bhbc : borrow.getBorrowHasBookCopiesList()){
                bhbc.setBorrow_id(borrow);
                // set status as borrowed
                bhbc.setBorrowhasbookcopystatus_id(borrowHasBookCopyStatusDao.getReferenceById(1));
                // set full fine amount 0
                bhbc.setFinecost(new BigDecimal("0.00"));
                // set book copy status to borrowed
                BookCopy bookCopy = bhbc.getBookcopy_id();

                bookCopy.setBookcopystatus_id(bookCopyStatusDao.getReferenceById(2)); // 2 = Borrowed

                bookCopyDao.save(bookCopy);
            }

            // set full fine amount 0
            borrow.setFullfineamount(new BigDecimal("0.00"));
            // set borrow code
            borrow.setBorrowcode(borrowDao.getNextBorrowCode());
            borrow.setBorrowstatus_id(borrowStatusDao.getReferenceById(1));

            // operation
            borrowDao.save(borrow);
            return "OK";
        }catch(Exception e){
            return "Borrow Record Save not completed."+e.getMessage();
        }
    }

    @Override
    @PutMapping(value = "/borrow/update")
    public String updateData(@RequestBody Borrow borrow) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Book-Borrowing");
        if(!userPrivi.getPrivi_update()){
            return "Borrow Record Update not completed : User haven't permission.";
        }
        // check existence
        // get id from object
        if(borrow.getId()==null){
            return "Borrow Record Update not completed : Borrow Record not exist.. !";
        }
        // get id from database check this borrow record is existing
        Borrow extBorrow= borrowDao.getReferenceById(borrow.getId());
        if(extBorrow.getId()==null){
            return "Borrow Record Update not completed : Borrow Record not exist.. !";
        }
        try{
            // check dependencies

            // set updated date time
            borrow.setUpdateddatetime(LocalDateTime.now());

            // set user id
            borrow.setUpdateduserid(userDao.getByUsername(authentication.getName()).getId());

            // add borrowing list for borrow has book copy table
            for(BorrowHasBookCopy bhbc : borrow.getBorrowHasBookCopiesList()){
                bhbc.setBorrow_id(borrow);
                // set status as borrowed
                bhbc.setBorrowhasbookcopystatus_id(borrowHasBookCopyStatusDao.getReferenceById(1));
                // set full fine amount 0
                bhbc.setFinecost(new BigDecimal("0.00"));

                // set book copy status to borrowed
                BookCopy bookCopy = bhbc.getBookcopy_id();

                bookCopy.setBookcopystatus_id(bookCopyStatusDao.getReferenceById(2)); // 2 = Borrowed
            }
            // operator
            borrowDao.save(borrow);
            return "OK";
        }catch(Exception e){
            return "Borrow Record Update not completed."+e.getMessage();
        }
    }

    @Override
    @DeleteMapping(value = "/borrow/delete")
    public String deleteData(@RequestBody Borrow borrow) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Book-Borrowing");
        if(!userPrivi.getPrivi_delete()){
            return "Borrow Record Delete not completed : User haven't permission.";
        }
        // check existence
        // get id from object
        if(borrow.getId()==null){
            return "Borrow Record Delete not completed : Borrow Record not exist.. !";
        }
        // get id from database check this borrow record is existing
        Borrow extBorrow= borrowDao.getReferenceById(borrow.getId());
        if(extBorrow.getId()==null){
            return "Borrow Record Delete not completed : Borrow Record not exist.. !";
        }
        try{
            // check dependencies

            // set updated date time
            extBorrow.setDeleteddatetime(LocalDateTime.now());

            // set user id
            extBorrow.setDeleteduserid(userDao.getByUsername(authentication.getName()).getId());

            extBorrow.setBorrowstatus_id(borrowStatusDao.getReferenceById(8));

            for(BorrowHasBookCopy bhbc : extBorrow.getBorrowHasBookCopiesList()){
                // set status as deleted
                bhbc.setBorrowhasbookcopystatus_id(borrowHasBookCopyStatusDao.getReferenceById(5));
                // set book copy status to available
                BookCopy bookCopy = bhbc.getBookcopy_id();

                bookCopy.setBookcopystatus_id(bookCopyStatusDao.getReferenceById(1)); // 1 = available
            }

           // change status

            // operator
            borrowDao.save(extBorrow);
            return "OK";
        }catch(Exception e){
            return "Borrow Record Delete not completed."+e.getMessage();
        }
    }



}
