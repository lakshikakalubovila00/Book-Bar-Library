package lk.bookbarlibrary.borrow.controller;

import lk.bookbarlibrary.AuthController;
import lk.bookbarlibrary.book.entity.Book;
import lk.bookbarlibrary.book.entity.BookCopy;
import lk.bookbarlibrary.borrow.dao.BorrowHasBookCopyDao;
import lk.bookbarlibrary.borrow.dao.BorrowHasBookCopyStatusDao;
import lk.bookbarlibrary.borrow.entity.BorrowHasBookCopy;
import lk.bookbarlibrary.member.entity.Member;
import lk.bookbarlibrary.membership.entity.Membership;
import lk.bookbarlibrary.notification.dao.NotificationDao;
import lk.bookbarlibrary.notification.entity.Notification;
import lk.bookbarlibrary.privilege.entity.Privilege;
import lk.bookbarlibrary.user.dao.UserDao;
import lk.bookbarlibrary.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
public class BorrowHasBookCopyController {

    @Autowired
    private BorrowHasBookCopyDao borrowHasBookCopyDao;

    @Autowired
    private AuthController authController;

    @Autowired
    private BorrowHasBookCopyStatusDao borrowHasBookCopyStatusDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private NotificationDao notificationDao;

    @GetMapping(value = "/borrowhasbookcopy/alldata", produces = "application/json")
    public List<BorrowHasBookCopy> getAllBorrowHasBookCopy(){
        return borrowHasBookCopyDao.findAll();
    }

    @GetMapping(value = "/borrowings/count", produces = "application/json")
    public Integer getBorrowingsCount(){
        return borrowHasBookCopyDao.getBorrowingsCount();
    }
    @GetMapping(value = "/overdues/count", produces = "application/json")
    public Integer getOverdueCount(){
        return borrowHasBookCopyDao.getOverdueCount();
    }

    // overdue books list
    @GetMapping(value = "/overdues", produces = "application/json")
    public List<BorrowHasBookCopy> getAllOverdueBorrowHasBookCopy(){
        return borrowHasBookCopyDao.getOverdueBooks();
    }

    // get status overdue borrowed books list
    @GetMapping(value = "/borrowedbooks/overdue", produces = "application/json")
    public List<BorrowHasBookCopy> getStatusOverdueBorrowedBooks(){
        return borrowHasBookCopyDao.getStatusOverdueBorrowedBooks();
    }

    @GetMapping(value = "/borrowhasbookcopy/byid/{borrowhasbookcopyid}", produces = "application/json")
    public BorrowHasBookCopy getBorrowHasBookCopyById(@PathVariable Integer borrowhasbookcopyid){
        return borrowHasBookCopyDao.getReferenceById(borrowhasbookcopyid);
    }
    @GetMapping(value = "/borrowhasbookcopy/bybookcopyid/{bookcopyid}", produces = "application/json")
    public BorrowHasBookCopy getBorrowHasBookCopyByBookCopyId(@PathVariable Integer bookcopyid){
        return borrowHasBookCopyDao.getBorrowHasBookCopyByBookCopyId(bookcopyid);
    }

    @GetMapping(value = "/borrowhasbookcopy/handoveredbooks", produces = "application/json")
    public List<BorrowHasBookCopy> getHandoveredBooks(){
        return borrowHasBookCopyDao.getHandoveredBooks();
    }
    @GetMapping(value = "/borrowhasbookcopy/renewedbooks", produces = "application/json")
    public List<BorrowHasBookCopy> getRenewedBooks(){
        return borrowHasBookCopyDao.getRenewedBooks();
    }
//    @RequestMapping("/payment")
//    public List<BorrowHasBookCopy> getPaymentData(@RequestParam List<Integer> bhbcIds){
//        return borrowHasBookCopyDao.findAllById(bhbcIds);
//    }

    @GetMapping(value = "/currentborrowings", produces = "application/json")
    public List<BorrowHasBookCopy> geCurrentBorrowings(){
        return borrowHasBookCopyDao.geCurrentBorrowings();
    }

    @PutMapping(value = "/borrowhasbookcopy/updateasoverdue")
    public String updateData(@RequestBody BorrowHasBookCopy borrowHasBookCopy) {
        //checked loged user has permission for update Book record (check user authentication and authorization)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Book-Borrowing");
        if(!userPrivi.getPrivi_update()){
            return "Borrowed Book updated as overdue not completed : User haven't permission.";
        }
        // check existence
        if(borrowHasBookCopy.getId()==null){
            return "Borrowed Book updated as overdue not completed : Record not exist.";
        }
        BorrowHasBookCopy extBorrowHasBookCopy=borrowHasBookCopyDao.getReferenceById(borrowHasBookCopy.getId());
        if(extBorrowHasBookCopy.getId()==null){
            return "Borrowed Book updated as overdue not completed : Record not exist.";
        }

        //check duplicate for unique columns
        // no unique columns

        try {

            Member member= borrowHasBookCopy.getBorrow_id().getMember_id();
            BookCopy bookCopy= borrowHasBookCopy.getBookcopy_id();

            // create notification
            Notification notification = new Notification();
            notification.setTitle("Borrowed book is overdue");
            notification.setMessagetext("Your borrowed book "+
                    bookCopy.getAccessionno()+ " - "+ bookCopy.getBook_id().getTitle()+
                    " is overdue. Please Handover & Fine may apply ");
            notification.setMember_id(member);
            notification.setIsread(false);
            notification.setAddeddatetime(LocalDate.now());
            notification.setAddeduserid(userDao.getByUsername(authentication.getName()).getId());
            notificationDao.save(notification);

            // update status to overdue
            borrowHasBookCopy.setBorrowhasbookcopystatus_id(borrowHasBookCopyStatusDao.getReferenceById(4));

            //operation
            borrowHasBookCopyDao.save(borrowHasBookCopy);
            return "OK";

        }catch (Exception e){
            return "Borrowed Book updated as overdue not completed : " + e.getMessage();
        }
    }

}
