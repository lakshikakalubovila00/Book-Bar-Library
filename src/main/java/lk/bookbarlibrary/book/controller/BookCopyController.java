package lk.bookbarlibrary.book.controller;

import lk.bookbarlibrary.AuthController;
import lk.bookbarlibrary.CommonController;
import lk.bookbarlibrary.book.dao.BookCopyDao;
import lk.bookbarlibrary.book.dao.BookCopyStatusDao;
import lk.bookbarlibrary.book.dao.BookDao;
import lk.bookbarlibrary.book.dao.BookStatusDao;
import lk.bookbarlibrary.book.entity.Book;
import lk.bookbarlibrary.book.entity.BookCopy;
import lk.bookbarlibrary.membership.entity.Membership;
import lk.bookbarlibrary.privilege.entity.Privilege;
import lk.bookbarlibrary.user.dao.UserDao;
import lk.bookbarlibrary.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
public class BookCopyController implements CommonController<BookCopy> {

    @Autowired
    private BookCopyDao bookCopyDao;

    @Autowired
    private AuthController authController;

    @Autowired
    private UserDao userDao;

    @Autowired
    private BookDao bookDao;

    @Autowired
    private BookStatusDao bookStatusDao;

    @Autowired
    private BookCopyStatusDao bookCopyStatusDao;

    @Override
    @RequestMapping(value = "/bookcopies")
    public ModelAndView getUi() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView bookcopiesView = new ModelAndView();
        bookcopiesView.addObject("loggedusername" , authentication.getName());
        bookcopiesView.addObject("title" , "Book Copies Management");
        bookcopiesView.setViewName("bookcopies.html");
        return bookcopiesView;
    }

    @Override
    @RequestMapping(value = "/bookcopies/alldata", produces = "application/json")
    public List<BookCopy> findAllData() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(), "Book-Copies");
        if(userPrivi.getPrivi_select()){
            return bookCopyDao.findAll();
        }else {
            return new ArrayList<>();
        }
    }

    @RequestMapping(value = "/bookcopies/alldata/orderbydesc", produces = "application/json")
    public List<BookCopy> findAllDataOrderByDesc() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(), "Book-Copies");
        if(userPrivi.getPrivi_select()){
            return bookCopyDao.findAllOrderByDesc();
        }else {
            return new ArrayList<>();
        }
    }

    @GetMapping(value = "/bookcopies/bybook/{bookid}",produces = "application/json")
    public List<BookCopy> filterBookCopiesByBook(@PathVariable("bookid") Integer bookid) {
        return bookCopyDao.filterBookCopiesByBook(bookid);
    }

    @GetMapping(value = "/books/count", produces = "application/json")
    public int getBookCopiesCount() {
        return bookCopyDao.getBookCopiesCount();
    }

    @GetMapping(value = "/bookcopy/byaccessionno/{accessionno}" ,produces = "application/json")
    public BookCopy getBookCopyByAccesionNo(@PathVariable String accessionno){
        return bookCopyDao.getBookCopyByAccesionNo(accessionno);
    }
    @GetMapping(value = "/availabelebookcopyforborrow/byaccessionno/{accessionno}" ,produces = "application/json")
    public BookCopy getAvailableBookCopyForBorrowByAccesionNo(@PathVariable String accessionno){
        return bookCopyDao.getAvailableBookCopyForBorrowByAccesionNo(accessionno);
    }
    @GetMapping(value = "/notavailabelebookcopyforborrow/byaccessionno/{accessionno}" ,produces = "application/json")
    public BookCopy getNotAvailableBookCopyForBorrowByAccesionNo(@PathVariable String accessionno){
        return bookCopyDao.getNotAvailableBookCopyForBorrowByAccesionNo(accessionno);
    }
    @GetMapping(value = "/bookcopyforreservation/byaccessionno/{accessionno}" ,produces = "application/json")
    public BookCopy getAvailableBookCopyForReservationByAccesionNo(@PathVariable String accessionno){
        return bookCopyDao.getBookCopyForReservationByAccesionNo(accessionno);
    }
    @GetMapping(value = "/notavailabelebookcopyforreservation/byaccessionno/{accessionno}" ,produces = "application/json")
    public BookCopy getNotAvailableBookCopyForReservationByAccesionNo(@PathVariable String accessionno){
        return bookCopyDao.getNotAvailableBookCopyForReservationByAccesionNo(accessionno);
    }
    @GetMapping(value = "/bookcopy/byid/{bookcopyid}", produces = "application/json")
    public BookCopy getBookCopyById(@PathVariable("bookcopyid") Integer bookcopyid) {
        return bookCopyDao.getReferenceById(bookcopyid);
    }

    @GetMapping(value = "/lastpurchasedbookcopy/bybook/{bookid}", produces = "application/json")
    public BookCopy getLastPurchasedBookCopyByBook(@PathVariable Integer bookid) {
        return bookCopyDao.getLastPurchasedBookCopyByBook(bookid);
    }

    @GetMapping(value = "/bookcopies/bytitle/{title}", produces = "application/json")
    public List<BookCopy> findAllBooksByTitle(@PathVariable String title){
        return bookCopyDao.getBookCopiesByTitle(title);
    }
    @GetMapping(value = "/bookcopies/byauthor/{author}", produces = "application/json")
    public List<BookCopy> findAllBooksByAuthor(@PathVariable String author){
        return bookCopyDao.getAllBookCopiessByAuthor(author);
    }
    @GetMapping(value = "/bookcopies/byisbn/{isbn}", produces = "application/json")
    public List<BookCopy> findAllBooksByISBN(@PathVariable String isbn){
        return bookCopyDao.getAllBookCopiessByISBN(isbn);
    }
    @GetMapping(value = "/bookcopies/byissn/{issn}", produces = "application/json")
    public List<BookCopy> findAllBooksByISSN(@PathVariable String issn){
        return bookCopyDao.getAllBookCopiessByISSN(issn);
    }
    @GetMapping(value = "/bookcopies/byseries/{series}", produces = "application/json")
    public List<BookCopy> findAllBooksBySeries(@PathVariable String series){
        return bookCopyDao.getAllBookCopiessBySeries(series);
    }
    @GetMapping(value = "/bookcopies/bydisplaycategory/{displaycategory}", produces = "application/json")
    public List<BookCopy> findAllBooksByDisplayCategory(@PathVariable String displaycategory){
        return bookCopyDao.getAllBookCopiessByDisplayCategory(displaycategory);
    }

    // purchase order - get price for book from last book copy

    @Override
    @PostMapping(value = "/bookcopy/insert")
    public String saveData(@RequestBody BookCopy bookCopy) {
        //checked loged user has permission for insert book record (check user authentication and authorization)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Book-Copies");
        if(!userPrivi.getPrivi_insert()){
            return "Book Copy Save not completed : User haven't permission.";
        }
        // check duplicate for unique columns
        try {
            //set auto generated values
            bookCopy.setAddeddatetime(LocalDateTime.now());
            User loggeduser = userDao.getByUsername(authentication.getName());
            bookCopy.setAddeduserid(loggeduser.getId());
            // copy no - C0001
            Book book = bookDao.getReferenceById(bookCopy.getBook_id().getId());
            bookCopy.setBook_id(book);

            // generate copy no
            String copyNo=bookCopyDao.getNextBookCopyNo(book.getId());
            bookCopy.setCopyno(copyNo);

            bookCopyDao.save(bookCopy);
            // check dependencies
            return "OK";

        }catch (Exception e){
            return "Book Copy Save not completed."+e.getMessage();
        }
    }


    @PostMapping(value = "/bookcopies/insertall")
    public String insertAllBookCopies(@RequestBody List<BookCopy> bookCopies) {
        //checked loged user has permission for insert book record (check user authentication and authorization)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Book-Copies");
        if(!userPrivi.getPrivi_insert()){
            return "Book Copy Save not completed : User haven't permission.";
        }
        // check duplicate for unique columns
        try {
            for (BookCopy bc : bookCopies) {
                //set auto generated values
                Book book = bookDao.getReferenceById(bc.getBook_id().getId());
                book.setBookstatus_id(bookStatusDao.getReferenceById(1));
                bookDao.save(book);

                // set book id
                bc.setBook_id(book);

                // generate copy no
                String copyNo=bookCopyDao.getNextBookCopyNo(book.getId());
                bc.setCopyno(copyNo);

                // generate accession no
                String accessionNo= book.getBookno()+ copyNo;
                bc.setAccessionno(accessionNo);

                // set is reserved false
                bc.setIsreserved(false);

                bc.setAddeddatetime(LocalDateTime.now());
                bc.setAddeduserid(userDao.getByUsername(authentication.getName()).getId());
                // copy no - C0001

                bookCopyDao.save(bc);

            }

            // check dependencies
            return "OK";

        }catch (Exception e){
            return "Book Copy Save not completed."+e.getMessage();
        }
    }

    @Override
    @PutMapping(value = "/bookcopy/update")
    public String updateData(@RequestBody BookCopy bookCopy) {
        //checked loged user has permission for insert book record (check user authentication and authorization)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Book-Copies");
        if(!userPrivi.getPrivi_update()){
            return "Book Copy Update not completed : User haven't permission.";
        }
        // check existence
        if(bookCopy.getId()==null){
            return "Book Copy Update not completed : Book Copy not exist.";
        }
        BookCopy extBookCopy = bookCopyDao.getReferenceById(bookCopy.getId());
        if(extBookCopy.getId()==null){
            return "Book Copy Update not completed : Book Copy not exist.";
        }
        try {
            //set auto generated values
            bookCopy.setUpdateddatetime(LocalDateTime.now());
            User loggeduser = userDao.getByUsername(authentication.getName());
            bookCopy.setUpdateduserid(loggeduser.getId());
            // operation
            bookCopyDao.save(bookCopy);
            // check dependencies
            return "OK";

        }catch (Exception e){
            return "Book Copy Update not completed."+e.getMessage();
        }
    }

    @Override
    @DeleteMapping(value = "/bookcopy/delete")
    public String deleteData(@RequestBody BookCopy bookCopy) {
        //checked loged user has permission for insert book record (check user authentication and authorization)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Book-Copies");
        if(!userPrivi.getPrivi_delete()){
            return "Book Copy Delete not completed : User haven't permission.";
        }
        // check existence
        if(bookCopy.getId()==null){
            return "Book Copy Delete not completed : Book Copy not exist.";
        }
        BookCopy extBookCopy = bookCopyDao.getReferenceById(bookCopy.getId());
        if(extBookCopy.getId()==null){
            return "Book Copy Delete not completed : Book Copy not exist.";
        }
        try {
            //set auto generated values
            extBookCopy.setDeleteddatetime(LocalDateTime.now());
            User loggeduser = userDao.getByUsername(authentication.getName());
            extBookCopy.setDeleteduserid(loggeduser.getId());
            // set status into delete
            extBookCopy.setBookcopystatus_id(bookCopyStatusDao.getReferenceById(4));
            // operation
            bookCopyDao.save(extBookCopy);
            // check dependencies
            return "OK";

        }catch (Exception e){
            return "Book Copy Delete not completed."+e.getMessage();
        }
    }
}
