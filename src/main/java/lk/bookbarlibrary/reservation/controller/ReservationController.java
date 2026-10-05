package lk.bookbarlibrary.reservation.controller;

import lk.bookbarlibrary.AuthController;
import lk.bookbarlibrary.CommonController;
import lk.bookbarlibrary.book.dao.BookCopyDao;
import lk.bookbarlibrary.book.entity.BookCopy;
import lk.bookbarlibrary.borrow.entity.BorrowHasBookCopy;
import lk.bookbarlibrary.member.entity.Member;
import lk.bookbarlibrary.notification.dao.NotificationDao;
import lk.bookbarlibrary.notification.dao.NotificationUserDao;
import lk.bookbarlibrary.notification.entity.Notification;
import lk.bookbarlibrary.notification.entity.NotificationUser;
import lk.bookbarlibrary.privilege.entity.Privilege;
import lk.bookbarlibrary.reservation.dao.ReservationDao;
import lk.bookbarlibrary.reservation.dao.ReservationStatusDao;
import lk.bookbarlibrary.reservation.entity.Reservation;
import lk.bookbarlibrary.reservation.entity.ReservationStatus;
import lk.bookbarlibrary.user.dao.UserDao;
import lk.bookbarlibrary.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
public class ReservationController implements CommonController<Reservation> {

    @Autowired
    private ReservationDao reservationDao;

    @Autowired
    private ReservationStatusDao reservationStatusDao;

    @Autowired
    private AuthController authController;

    @Autowired
    private UserDao userDao;

    @Autowired
    private BookCopyDao bookCopyDao;

    @Autowired
    private NotificationDao  notificationDao;

    @Autowired
    private NotificationUserDao notificationUserDao;

    @Override
    @RequestMapping(value="/reservation")
    public ModelAndView getUi() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView bookreservationView = new ModelAndView();
        bookreservationView.addObject("loggedusername", authentication.getName());
        bookreservationView.addObject("title", "Book Reservation Management");
        bookreservationView.setViewName("bookreservation.html");
        return bookreservationView;
    }


    @GetMapping(value = "/reservation/byid/{reservationid}" ,produces = "application/json")
    public Reservation getReservationById(@PathVariable Integer reservationid) {
        return reservationDao.getReferenceById(reservationid);
    }

    @GetMapping(value = "/reservation/reservedcount/{memberid}")
    public Integer getReservedBookCount(@PathVariable Integer memberid){
        return reservationDao.getReservedBookCountByMember(memberid);
    }

    @GetMapping(value = "/reservations/count", produces = "application/json")
    public Integer getReservationsCount(){
        return reservationDao.getReservationsCount();
    }

    @GetMapping(value = "/reservation/bymember/{memberid}", produces = "application/json")
    public Reservation getReservationByMemberId(@PathVariable Integer memberid){
        return reservationDao.getReservationByMember(memberid);
    }


    @GetMapping(value = "/reservation/bybookcopyid/{bookcopyid}", produces = "application/json")
    public List<Reservation> getReservationByBookCopyId(@PathVariable Integer bookcopyid) {
        return reservationDao.getReservationByBookCopyId(bookcopyid);
    }

    @GetMapping(value = "/reservationcount/bybookcopyid/{bookcopyid}", produces = "application/json")
    public Integer getReservationCountByBookCopy(@PathVariable Integer bookcopyid){
        return reservationDao.getReservationCountByBookCopy(bookcopyid);
    }

    @GetMapping(value = "/approvedreservation/bybookcopyid/{bookcopyid}", produces = "application/json")
    public Reservation getApprovedReservationByBookCopyId(@PathVariable Integer bookcopyid) {
        return reservationDao.getApprovedReservationByBookCopyId(bookcopyid);
    }

    // expired reservations list
    @GetMapping(value = "/expiredreservationslist", produces = "application/json")
    public List<Reservation> getExpiredReservations(){
        return reservationDao.getExpiredReservations();
    }

    // get from status as expired reservations list
    @GetMapping(value = "/reservation/expired", produces = "application/json")
    public List<Reservation> getStatusAsExpiredReservations(){
        return reservationDao.getStatusAsExpiredReservations();
    }

    @Override
    @GetMapping(value = "/reservation/alldata", produces = "application/json")
    public List<Reservation> findAllData() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(),"Book-Reservation");
        if(userPrivi.getPrivi_select()){
            return reservationDao.findAll();
        }else{
            return new ArrayList<>();
        }
    }

    @Override
    @PostMapping(value = "/reservation/insert")
    public String saveData(@RequestBody Reservation reservation) {

        // check authentication and authorization
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(),"Book-Reservation");

        // check logged user privileges
        if(!userPrivi.getPrivi_insert()){
            return "Reservation Save not completed : User haven't permission.";
        }
        try{

            // if reservation status is pending make notification
            if(reservation.getReservationstatus_id().getId()==1){
                Member member= reservation.getMember_id();
                BookCopy bookCopy= reservation.getBookcopy_id();

                // create notification
                NotificationUser notificationuser = new NotificationUser();
                notificationuser.setTitle("New reservation received");
                notificationuser.setMessagetext("Reservation added for "+
                        bookCopy.getAccessionno()+ " - "+ bookCopy.getBook_id().getTitle()+
                        " .");
                User librarian = userDao.findByDesignation("LIBRARIAN");

                notificationuser.setUser_id(librarian);
                notificationuser.setIsread(false);
                notificationuser.setAddeddatetime(LocalDate.now());
                notificationuser.setAddeduserid(userDao.getByUsername(authentication.getName()).getId());
                notificationUserDao.save(notificationuser);
            }

            // set added date time
            reservation.setAddeddatetime(LocalDateTime.now());

            // set added user id
            reservation.setAddeduserid(userDao.getByUsername(authentication.getName()).getId());

            // generate reservation no automatically
            reservation.setReservationno(reservationDao.getNextReservationNo());

            // set book copy as reserved
            BookCopy bookCopy= reservation.getBookcopy_id();
            bookCopy.setIsreserved(true);

            // update the book copy
            bookCopyDao.save(bookCopy);

            // save reservation operation
            reservationDao.save(reservation);

            // pass success message
            return "OK";
        }catch (Exception e){
            // if error occurred
            return "Reservation insert not completed. "+e.getMessage();
        }
    }

    @Override
    @PutMapping(value = "/reservation/update")
    public String updateData(@RequestBody Reservation reservation) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(),"Book-Reservation");
        if(!userPrivi.getPrivi_update()){
            return "Reservation Update not completed : User haven't permission.";
        }
        // check existence
        if(reservation.getId()==null){
            return "Reservation Update not completed : Reservation Not Exist..";
        }
        Reservation extReservation= reservationDao.getReferenceById(reservation.getId());
        if(extReservation.getId()==null){
            return "Reservation Update not completed : Reservation Not Exist..";
        }
        try{
            // set auto generated value
            // set added date time
            reservation.setUpdateddatetime(LocalDateTime.now());
            // set added user id
            reservation.setUpdateduserid(userDao.getByUsername(authentication.getName()).getId());

            // if reservation status is cancelled make book copy  - is reserved false
            if(reservation.getReservationstatus_id().getId()==4){
                BookCopy bookCopy= reservation.getBookcopy_id();
                if (bookCopy != null) {
                    bookCopy.setIsreserved(false);
                    bookCopyDao.save(bookCopy);
                }
            }

            // if reservation status is approved make notification
            if(reservation.getReservationstatus_id().getId()==2){
                Member member= reservation.getMember_id();
                BookCopy bookCopy= reservation.getBookcopy_id();

                // create notification
                Notification notification = new Notification();
                notification.setTitle("Reservation is approved ");
                notification.setMessagetext("Your reservation "+
                        bookCopy.getAccessionno()+ " - "+ bookCopy.getBook_id().getTitle()+
                        " is approved. ");
                notification.setMember_id(member);
                notification.setIsread(false);
                notification.setAddeddatetime(LocalDate.now());
                notification.setAddeduserid(userDao.getByUsername(authentication.getName()).getId());
                notificationDao.save(notification);
            }
            // operation
            reservationDao.save(reservation);

            // check dependencies
            return "OK";
        }catch (Exception e){
            return "Reservation update not completed. "+e.getMessage();
        }

    }

    @Override
    @DeleteMapping(value = "/reservation/delete")
    public String deleteData(@RequestBody Reservation reservation) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(),"Book-Reservation");
        if(!userPrivi.getPrivi_delete()){
            return "Reservation Delete not completed : User haven't permission.";
        }
        // check existence
        if(reservation.getId()==null){
            return "Reservation Delete not completed : Reservation Not Exist..";
        }
        Reservation extReservation= reservationDao.getReferenceById(reservation.getId());
        if(extReservation.getId()==null){
            return "Reservation Delete not completed : Reservation Not Exist..";
        }
        try{
            // set auto generated value
            // set added date time
            extReservation.setDeleteddatetime(LocalDateTime.now());
            // set added user id
            extReservation.setDeleteduserid(userDao.getByUsername(authentication.getName()).getId());
            extReservation.setReservationstatus_id(reservationStatusDao.getReferenceById(6));
            // operation
            reservationDao.save(extReservation);

            // check dependencies
            return "OK";
        }catch (Exception e){
            return "Reservation delete not completed. "+e.getMessage();
        }
    }

    @PutMapping(value = "/reservation/updateasexpired")
    public String updateAsExpired(@RequestBody Reservation reservation) {
        //checked logged user has permission for update Book record (check user authentication and authorization)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Book-Reservation");
        if(!userPrivi.getPrivi_update()){
            return "Reservation updated as expired not completed : User haven't permission.";
        }
        // check existence
        if(reservation.getId()==null){
            return "Reservation updated as expired not completed : Record not exist.";
        }
        Reservation extReservation=reservationDao.getReferenceById(reservation.getId());
        if(extReservation.getId()==null){
            return "Reservation updated as expired not completed : Record not exist.";
        }

        //check duplicate for unique columns
        // no unique columns

        try {

            Member member= reservation.getMember_id();
            BookCopy bookCopy= reservation.getBookcopy_id();

            // create notification
            Notification notification = new Notification();
            notification.setTitle("Reservation is expired");
            notification.setMessagetext("Your reservation "+
                    bookCopy.getAccessionno()+ " - "+ bookCopy.getBook_id().getTitle()+
                    " is expired. ");
            notification.setMember_id(member);
            notification.setIsread(false);
            notification.setAddeddatetime(LocalDate.now());
            notification.setAddeduserid(userDao.getByUsername(authentication.getName()).getId());
            notificationDao.save(notification);

            // update status to expired
            reservation.setReservationstatus_id(reservationStatusDao.getReferenceById(5));

            //operation
            reservationDao.save(reservation);
            return "OK";

        }catch (Exception e){
            return "Reservation updated as expired not completed : " + e.getMessage();
        }
    }
}
