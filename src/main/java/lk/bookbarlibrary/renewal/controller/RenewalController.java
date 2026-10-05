package lk.bookbarlibrary.renewal.controller;

import lk.bookbarlibrary.AuthController;
import lk.bookbarlibrary.book.dao.BookCopyDao;
import lk.bookbarlibrary.book.dao.BookCopyStatusDao;
import lk.bookbarlibrary.book.entity.BookCopy;
import lk.bookbarlibrary.borrow.dao.BorrowDao;
import lk.bookbarlibrary.borrow.dao.BorrowHasBookCopyDao;
import lk.bookbarlibrary.borrow.dao.BorrowHasBookCopyStatusDao;
import lk.bookbarlibrary.borrow.dao.BorrowStatusDao;
import lk.bookbarlibrary.borrow.entity.Borrow;
import lk.bookbarlibrary.borrow.entity.BorrowHasBookCopy;
import lk.bookbarlibrary.notification.dao.NotificationDao;
import lk.bookbarlibrary.notification.entity.Notification;
import lk.bookbarlibrary.privilege.entity.Privilege;
import lk.bookbarlibrary.reservation.dao.ReservationDao;
import lk.bookbarlibrary.reservation.entity.Reservation;
import lk.bookbarlibrary.user.dao.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;


import java.time.LocalDate;
import java.util.List;

@RestController
public class RenewalController {
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
    private ReservationDao reservationDao;
    @Autowired
    private NotificationDao notificationDao;

    @RequestMapping(value="/renewal")
    public ModelAndView renewalUI(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView renewalView = new ModelAndView();
        renewalView.addObject("loggedusername", authentication.getName());
        renewalView.addObject("title", "Book Renewal Management");
        renewalView.setViewName("renewal.html");
        return renewalView;
    }

    @PutMapping(value = "/renewal/saverenewbooks")
    public String handoverBooksSave(@RequestBody List<Borrow> borrowList) {
        //checked loged user has permission for insert borrow record (check user authentication and authorization)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Book-Renewals");
        if(!userPrivi.getPrivi_insert()){
            return "Book Renewal Process not completed : User haven't permission.";
        }
        try{
            //set auto generated values
            for(Borrow borrowReq : borrowList) {
                // get borrow by code
                Borrow borrow = borrowDao.getReferenceById(borrowReq.getId());

                if(borrowReq.getBorrowHasBookCopiesList() !=null){
                    for (BorrowHasBookCopy bhbcReq : borrowReq.getBorrowHasBookCopiesList()) {

                        BorrowHasBookCopy extBhbc = borrowHasBookCopyDao.findById(bhbcReq.getId()).orElse(null);
                        if(extBhbc == null){
                            continue;
                        }

                        // maintain relationship
                        extBhbc.setBorrow_id(borrow);

                        // set renew data
                        extBhbc.setRenewdate(bhbcReq.getRenewdate());
                        extBhbc.setRenewhandoverduedate(bhbcReq.getRenewhandoverduedate());

                        // change borrow has book copy status -> renewed
                        extBhbc.setBorrowhasbookcopystatus_id(borrowHasBookCopyStatusDao.getReferenceById(2));
                        System.out.println(extBhbc);

                        borrowHasBookCopyDao.save(extBhbc);

                        // if this book copy is reserved need to extend the reservation borrow date into the renew handover due date
                        BookCopy bookCopy = extBhbc.getBookcopy_id();

                        if(bookCopy.getIsreserved()){
                           LocalDate extendedDate= extBhbc.getRenewhandoverduedate();
                            // get reservation
                            Reservation reservation = reservationDao.getActiveReservationByBookCopy(bookCopy.getId());

                            if (reservation != null) {
                                // extend reservation borrow date (or due date based on your design)
                                reservation.setBorrowdate(extendedDate);

                                reservationDao.save(reservation);

                                // create notification
                                Notification notification = new Notification();
                                notification.setTitle("Borrow Date Extended");
                                notification.setMessagetext("Your reservation for book "+
                                                            bookCopy.getAccessionno()+ " - "+ bookCopy.getBook_id().getTitle()+
                                                            " has been extended until "+
                                                            extendedDate);
                                notification.setMember_id(reservation.getMember_id());
                                notification.setIsread(false);
                                notification.setAddeddatetime(LocalDate.now());
                                notification.setAddeduserid(userDao.getByUsername(authentication.getName()).getId());
                                notificationDao.save(notification);
                            }
                        }

                        // set book copy status to available
                        bookCopy.setBookcopystatus_id(bookCopyStatusDao.getReferenceById(2)); // 2 = borrowed

                        bookCopyDao.save(bookCopy);
                    }
                }
                List<BorrowHasBookCopy> allBooks = borrowHasBookCopyDao.getBorrowedBookCopiesByBorrowcode(borrow.getBorrowcode());
                int renewedCount = 0;

                for(BorrowHasBookCopy bhbc : allBooks){
                    if(bhbc.getBorrowhasbookcopystatus_id().getId() == 2){
                        renewedCount++;
                    }
                }
                if(renewedCount == 0){
                    borrow.setBorrowstatus_id(
                            borrowStatusDao.getReferenceById(1)); // Borrowed

                }else if(renewedCount < allBooks.size()){

                    borrow.setBorrowstatus_id(
                            borrowStatusDao.getReferenceById(4)); // Partially Renewed

                }else if(renewedCount == allBooks.size()){

                    borrow.setBorrowstatus_id(
                            borrowStatusDao.getReferenceById(5)); // Fully Renewed
                }

                borrowDao.save(borrow);
            }

            return "OK";
        }catch(Exception e){
            return "Book Renewal Process not completed."+e.getMessage();
        }
    }

    @PutMapping(value = "/renewal/updaterenewbooks")
    public String handoverBooksUpadate(@RequestBody List<Borrow> borrowList) {
        //checked loged user has permission for insert borrow record (check user authentication and authorization)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Book-Renewals");
        if(!userPrivi.getPrivi_insert()){
            return "Book Renewal Process Update not completed : User haven't permission.";
        }
        try{
            //set auto generated values
            for(Borrow borrowReq : borrowList) {
                // get borrow by code
                Borrow borrow = borrowDao.getReferenceById(borrowReq.getId());

                if(borrowReq.getBorrowHasBookCopiesList() !=null){
                    for (BorrowHasBookCopy bhbcReq : borrowReq.getBorrowHasBookCopiesList()) {

                        BorrowHasBookCopy extBhbc = borrowHasBookCopyDao.findById(bhbcReq.getId()).orElse(null);
                        if(extBhbc == null){
                            continue;
                        }

                        // maintain relationship
                        extBhbc.setBorrow_id(borrow);

                        // set handover data
                        extBhbc.setRenewdate(bhbcReq.getRenewdate());
                        extBhbc.setRenewhandoverduedate(bhbcReq.getRenewhandoverduedate());

                        // change book copy status -> renewed
                        extBhbc.setBorrowhasbookcopystatus_id(borrowHasBookCopyStatusDao.getReferenceById(2));
                        System.out.println(extBhbc);

                        borrowHasBookCopyDao.save(extBhbc);

                        // set book copy status to available
                        BookCopy bookCopy = extBhbc.getBookcopy_id();

                        bookCopy.setBookcopystatus_id(bookCopyStatusDao.getReferenceById(3)); // 3 = borrowed

                        bookCopyDao.save(bookCopy);
                    }
                }
                List<BorrowHasBookCopy> allBooks = borrowHasBookCopyDao.getBorrowedBookCopiesByBorrowcode(borrow.getBorrowcode());
                int renewedCount = 0;

                for(BorrowHasBookCopy bhbc : allBooks){
                    if(bhbc.getBorrowhasbookcopystatus_id().getId() == 3){
                        renewedCount++;
                    }
                }
                if(renewedCount == 0){

                    borrow.setBorrowstatus_id(
                            borrowStatusDao.getReferenceById(1)); // Borrowed

                }else if(renewedCount < allBooks.size()){

                    borrow.setBorrowstatus_id(
                            borrowStatusDao.getReferenceById(4)); // Partially Renewed

                }else if(renewedCount == allBooks.size()){

                    borrow.setBorrowstatus_id(
                            borrowStatusDao.getReferenceById(5)); // Fully Renewed
                }

                borrowDao.save(borrow);
            }

            return "OK";
        }catch(Exception e){
            return "Book Renewal Process Update not completed."+e.getMessage();
        }
    }

    @DeleteMapping(value = "/renewal/deleterenewbooks")
    public String handoverBooksDelete(@RequestBody BorrowHasBookCopy borrowHasBookCopy) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Book-Renewals");
        if(!userPrivi.getPrivi_delete()){
            return "Book Renewal Record Delete not completed : User haven't permission.";
        }
        // check existence
        // get id from object
        if(borrowHasBookCopy.getId()==null){
            return "Book Renewal Record Delete not completed : Borrow Record not exist.. !";
        }
        // get id from database check this borrow record is existing
        BorrowHasBookCopy extBorrowHasBookCopy= borrowHasBookCopyDao.getReferenceById(borrowHasBookCopy.getId());
        if(extBorrowHasBookCopy.getId()==null){
            return "Book Renewal Record Delete not completed : Borrow Record not exist.. !";
        }
        try{
            // check dependencies

            // set updated date time
            // extBorrowHasBookCopy.setDeleteddatetime(LocalDateTime.now());

            // set user id
            //  extBorrowHasBookCopy.setDeleteduserid(userDao.getByUsername(authentication.getName()).getId());

            // change status
            extBorrowHasBookCopy.setBorrowhasbookcopystatus_id(borrowHasBookCopyStatusDao.getReferenceById(5));


            // operator
            borrowHasBookCopyDao.save(extBorrowHasBookCopy);
            return "OK";
        }catch(Exception e){
            return "Book Renewal Record Delete not completed."+e.getMessage();
        }
    }
}
