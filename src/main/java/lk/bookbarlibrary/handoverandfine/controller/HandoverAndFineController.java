package lk.bookbarlibrary.handoverandfine.controller;

import lk.bookbarlibrary.AuthController;
import lk.bookbarlibrary.book.dao.BookCopyDao;
import lk.bookbarlibrary.book.dao.BookCopyStatusDao;
import lk.bookbarlibrary.book.dao.DamageStatusDao;
import lk.bookbarlibrary.book.entity.BookCopy;
import lk.bookbarlibrary.borrow.dao.BorrowDao;
import lk.bookbarlibrary.borrow.dao.BorrowHasBookCopyDao;
import lk.bookbarlibrary.borrow.dao.BorrowHasBookCopyStatusDao;
import lk.bookbarlibrary.borrow.dao.BorrowStatusDao;
import lk.bookbarlibrary.borrow.entity.Borrow;
import lk.bookbarlibrary.borrow.entity.BorrowHasBookCopy;
import lk.bookbarlibrary.borrow.entity.BorrowStatus;
import lk.bookbarlibrary.privilege.entity.Privilege;
import lk.bookbarlibrary.user.dao.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.math.BigDecimal;
import java.util.List;

@RestController
public class HandoverAndFineController {
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
    private DamageStatusDao damageStatusDao;

    @Autowired
    private BookCopyStatusDao bookCopyStatusDao;

    @Autowired
    private BorrowStatusDao borrowStatusDao;

    @RequestMapping(value="/handoverandfine")
    public ModelAndView handoverandfineUI(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView handoverandfineView = new ModelAndView();
        handoverandfineView.addObject("loggedusername" , authentication.getName());
        handoverandfineView.addObject("title", "Handover and Fine Management");
        handoverandfineView.setViewName("handoverandfine.html");
        return handoverandfineView;
    }

    @PutMapping(value = "/handoverandfine/savehandoverbooks")
    // frontend sends a JSON array with one or more borrow records
    public String handoverBooksSave(@RequestBody List<Borrow> borrowList) {
        System.out.println("Received Borrow List: " + borrowList);
        //checked loged user has permission for insert borrow record (check user authentication and authorization)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Book-Handover-and-Fine");
        if(!userPrivi.getPrivi_insert()){
            return "Handover & Fine Process not completed : User haven't permission.";
        }
        try{
            //set auto generated values
            // Processes each borrow  individually
            for(Borrow borrowReq : borrowList) {
                // get borrow by code
                Borrow borrow = borrowDao.getReferenceById(borrowReq.getId());

                // starts the fine amount at zero
                BigDecimal totalFine = BigDecimal.ZERO;

                if(borrowReq.getBorrowHasBookCopiesList() !=null){
                    // process each returned book
                    for (BorrowHasBookCopy bhbcReq : borrowReq.getBorrowHasBookCopiesList()) {

                        // loads the existing record from the database. if not exist, skip
                        BorrowHasBookCopy extBhbc = borrowHasBookCopyDao.findById(bhbcReq.getId()).orElse(null);
                        if(extBhbc == null){
                            continue;
                        }

                        // maintain relationship
                        extBhbc.setBorrow_id(borrow);

                        // set handover data
                        extBhbc.setActualhandovereddate(bhbcReq.getActualhandovereddate());
                        extBhbc.setDelaydays(bhbcReq.getDelaydays());
                        extBhbc.setDamagepercentage(bhbcReq.getDamagepercentage());
                        extBhbc.setDamagetype_id(bhbcReq.getDamagetype_id());
                        extBhbc.setAdditionalcharges(bhbcReq.getAdditionalcharges());
                        extBhbc.setFinecost(bhbcReq.getFinecost());

                        // change book copy status -> handovered
                        extBhbc.setBorrowhasbookcopystatus_id(borrowHasBookCopyStatusDao.getReferenceById(3));
                        System.out.println(extBhbc);

                        borrowHasBookCopyDao.save(extBhbc);

                        // set book copy status to available
                        BookCopy bookCopy = extBhbc.getBookcopy_id();

                        bookCopy.setBookcopystatus_id(bookCopyStatusDao.getReferenceById(1)); // 1 = Available

                        if(bhbcReq.getDamagetype_id().getId().equals(1)){
                            // no damage
                            bookCopy.setDamagestatus_id(damageStatusDao.getReferenceById(1));
                        }
                        else if(bhbcReq.getDamagetype_id().getId().equals(2)){
                            // Partial damage
                            bookCopy.setDamagestatus_id(damageStatusDao.getReferenceById(2));
                        }
                        else if(bhbcReq.getDamagetype_id().getId().equals(3)){
                            // Fully damage
                            bookCopy.setDamagestatus_id(damageStatusDao.getReferenceById(3));
                        }
                        else if(bhbcReq.getDamagetype_id().getId().equals(4)){
                            // lost
                            bookCopy.setDamagestatus_id(damageStatusDao.getReferenceById(4));
                        }

                        bookCopyDao.save(bookCopy);
                    }
                }
                // Retrieve All Borrowed Books
                List<BorrowHasBookCopy> allBooks = borrowHasBookCopyDao.getBorrowedBookCopiesByBorrowcode(borrow.getBorrowcode());
                int returnedCount = 0;

                for(BorrowHasBookCopy bhbc : allBooks){
                    // 3- handovered
                    if(bhbc.getBorrowhasbookcopystatus_id().getId() == 3){
                        returnedCount++;
                    }
                    if (bhbc.getFinecost() != null) {
                        totalFine = totalFine.add(bhbc.getFinecost());
                    }
                }
                if(returnedCount == 0){

                    borrow.setBorrowstatus_id(
                            borrowStatusDao.getReferenceById(1)); // Borrowed

                }else if(returnedCount < allBooks.size()){
                    // Some books returned
                    borrow.setBorrowstatus_id(
                            borrowStatusDao.getReferenceById(2)); // Partially Handovered

                }else if(returnedCount == allBooks.size()){
                    // all books returned
                    borrow.setBorrowstatus_id(
                            borrowStatusDao.getReferenceById(3)); // Fully Handovered
                }
                // update total fine for that borrow
                borrow.setFullfineamount(totalFine);
                borrowDao.save(borrow);
            }

            return "OK";
        }catch(Exception e){
            return "Handover & Fine Process not completed."+e.getMessage();
        }
    }

    @PutMapping(value = "/handoverandfine/updatehandoverbooks")
    public String handoverBooksUpdate(@RequestBody List<Borrow> borrowList) {
        System.out.println("Updated Borrow List: " + borrowList);
        //checked loged user has permission for insert borrow record (check user authentication and authorization)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Book-Handover-and-Fine");
        if(!userPrivi.getPrivi_insert()){
            return "Handover & Fine Process Update not completed : User haven't permission.";
        }

        try{
            //set auto generated values
            for(Borrow borrowReq : borrowList) {
                // get borrow by code
                Borrow borrow = borrowDao.getReferenceById(borrowReq.getId());

                if(borrow == null){
                    return "Borrow Record not exist for ID : " + borrowReq.getId();
                }

                BigDecimal totalFine = BigDecimal.ZERO;

                if(borrowReq.getBorrowHasBookCopiesList() !=null){
                    for (BorrowHasBookCopy bhbcReq : borrowReq.getBorrowHasBookCopiesList()) {

                        BorrowHasBookCopy extBhbc = borrowHasBookCopyDao.findById(bhbcReq.getId()).orElse(null);
                        if(extBhbc == null){
                            continue;
                        }

                        // maintain relationship
                        extBhbc.setBorrow_id(borrow);

                        // set handover data
                        extBhbc.setActualhandovereddate(bhbcReq.getActualhandovereddate());
                        extBhbc.setDelaydays(bhbcReq.getDelaydays());
                        extBhbc.setDamagepercentage(bhbcReq.getDamagepercentage());
                        extBhbc.setDamagetype_id(bhbcReq.getDamagetype_id());
                        extBhbc.setFinecost(bhbcReq.getFinecost());

                        // change book copy status -> handovered
                        extBhbc.setBorrowhasbookcopystatus_id(borrowHasBookCopyStatusDao.getReferenceById(3));
                        System.out.println(extBhbc);

                        borrowHasBookCopyDao.save(extBhbc);
                        // set book copy status to available
                        BookCopy bookCopy = extBhbc.getBookcopy_id();

                        bookCopy.setBookcopystatus_id(bookCopyStatusDao.getReferenceById(1)); // 1= Available

                        bookCopyDao.save(bookCopy);
                    }
                }
                List<BorrowHasBookCopy> allBooks = borrowHasBookCopyDao.getBorrowedBookCopiesByBorrowcode(borrow.getBorrowcode());
                int returnedCount = 0;

                for(BorrowHasBookCopy bhbc : allBooks){
                    if(bhbc.getBorrowhasbookcopystatus_id().getId() == 3){
                        returnedCount++;
                    }
                    if (bhbc.getFinecost() != null) {
                        totalFine = totalFine.add(bhbc.getFinecost());
                    }
                }
                if(returnedCount == 0){

                    borrow.setBorrowstatus_id(
                            borrowStatusDao.getReferenceById(1)); // Borrowed

                }else if(returnedCount < allBooks.size()){

                    borrow.setBorrowstatus_id(
                            borrowStatusDao.getReferenceById(2)); // Partially Handovered

                }else if(returnedCount == allBooks.size()){

                    borrow.setBorrowstatus_id(
                            borrowStatusDao.getReferenceById(3)); // Fully Handovered
                }
                // update total fine for that borrow
                borrow.setFullfineamount(totalFine);
                borrowDao.save(borrow);
            }

            return "OK";
        }catch(Exception e){
            return "Handover & Fine Process Update not completed."+e.getMessage();
        }
    }

    @DeleteMapping(value = "/handoverandfine/deletehandoverbooks")
    public String handoverBooksDelete(@RequestBody BorrowHasBookCopy borrowHasBookCopy) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Book-Handover-and-Fine");
        if(!userPrivi.getPrivi_delete()){
            return "Handover & Fine Record Delete not completed : User haven't permission.";
        }
        // check existence
        // get id from object
        if(borrowHasBookCopy.getId()==null){
            return "Handover & Fine Record Delete not completed : Borrow Record not exist.. !";
        }
        // get id from database check this borrow record is existing
        BorrowHasBookCopy extBorrowHasBookCopy= borrowHasBookCopyDao.getReferenceById(borrowHasBookCopy.getId());
        if(extBorrowHasBookCopy.getId()==null){
            return "Handover & Fine Record Delete not completed : Borrow Record not exist.. !";
        }
        try{

            // change status
            extBorrowHasBookCopy.setBorrowhasbookcopystatus_id(borrowHasBookCopyStatusDao.getReferenceById(5));


            // operator
            borrowHasBookCopyDao.save(extBorrowHasBookCopy);
            return "OK";
        }catch(Exception e){
            return "Handover & Fine Record Delete not completed."+e.getMessage();
        }
    }
}
