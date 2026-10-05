package lk.bookbarlibrary.book.controller;

import lk.bookbarlibrary.AuthController;
import lk.bookbarlibrary.CommonController;
import lk.bookbarlibrary.book.dao.BookDao;
import lk.bookbarlibrary.book.dao.BookStatusDao;
import lk.bookbarlibrary.book.entity.Book;
import lk.bookbarlibrary.book.entity.BookStatus;
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
public class BookController implements CommonController<Book> {

    // autowired- Dependency Injection in Spring Boot
    // It tells the Spring container to automatically create and inject the required Bean into a class
    // so we don't need to create objects using the new keyword
    @Autowired
    private BookDao bookDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private AuthController authController;

    @Autowired
    private BookStatusDao bookStatusDao;

    // @GetMapping - when the endpoint only retrieves data.
    // @PostMapping - when creating new data.
    // @PutMapping - when updating data.
    // @DeleteMapping - when deleting data.
    // @RequestMapping - at the class level to define a common URL prefix, or when you need more flexibility.

    // request mapping- general-purpose annotation
    // It can handle any HTTP request method (GET, POST, PUT, DELETE, etc.) unless you specify one
    @RequestMapping(value = "/book")
    @Override
	public ModelAndView getUi(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		ModelAndView booksView = new ModelAndView();
        booksView.addObject("loggedusername" , authentication.getName());
        booksView.addObject("title" , "Book Management");
		booksView.setViewName("book.html");
		return booksView;
	}
    // same mapping for booktable.html

    // create mapping for get book object by using given id (path variable)
    @GetMapping(value = "/book/byid/{bookid}" ,produces = "application/json")
    public Book getBookById(@PathVariable Integer bookid){
        return bookDao.getReferenceById(bookid);
    }

    // define get mapping for get book by supplier
    @GetMapping(value = "/book/bysupplier/{supplierid}" ,produces = "application/json")
    public List<Book> getBooksBySupplierId(@PathVariable Integer supplierid){
        return bookDao.getBookListBySupplier(supplierid);
    }

    @GetMapping(value = "/book/bypurchaseorder/{purchaseid}", produces = "application/json")
    public List<Book> getBooksByPurchaseOrder(@PathVariable Integer purchaseid){
        return bookDao.getBookListByPurchaseOrder(purchaseid);
    }

    @GetMapping(value = "/book/alldata", produces = "application/json")
    @Override
    public List<Book> findAllData() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(), "Book");
        if(userPrivi.getPrivi_select()){
            return bookDao.findAll();
        }else {
            return new ArrayList<>();
        }
    }
    @GetMapping(value = "/book/alldatabyorderdesc", produces = "application/json")
    public List<Book> findAllDataByOrderDesc() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(), "Book");
        if(userPrivi.getPrivi_select()){
            return bookDao.findAllDataByOrderDesc();
        }else {
            return new ArrayList<>();
        }
    }

    @GetMapping(value = "/book/list", produces = "application/json")
    public List<Book> findAllSelectedData() {
            return bookDao.list();

    }
    @GetMapping(value = "/book/listbysupplierwithoutsupplybook/{supplierid}", produces = "application/json")
    public List<Book> findAllSelectedDataWithoutSupplyBySupplier(@PathVariable ("supplierid")Integer supplierid) {
        return bookDao.listWithoutSupply(supplierid);

    }

    @GetMapping(value = "/book/titles", produces = "application/json")
    public List<String> findAllTitles(){
        return bookDao.findAllTitles();
    }

    @GetMapping(value = "/book/authors", produces = "application/json")
    public List<String> findAllAuthors(){
        return bookDao.findAllAuthors();
    }

    @GetMapping(value = "/book/isbns", produces = "application/json")
    public List<String> findAllISBSNs(){
        return bookDao.findAllISBSNs();
    }

    @GetMapping(value = "/book/issns", produces = "application/json")
    public List<String> findAllISSNs(){
        return bookDao.findAllISSNs();
    }

    @GetMapping(value = "/book/publishers", produces = "application/json")
    public List<String> findAllPublishers(){
        return bookDao.findAllPublishers();
    }

    @GetMapping(value = "/book/series", produces = "application/json")
    public List<String> findAllSeries(){
        return bookDao.findAllSeries();
    }

    @GetMapping(value = "/book/displaycategories", produces = "application/json")
    public List<String> findAllDisplayCategories(){
        return bookDao.findAllDisplayCategories();
    }



    @GetMapping(value="/book/listbycategory/{categoryid}", produces = "application/json")
    public List<Book> findAllSelectedDataByCategory(@PathVariable ("categoryid")Integer categoryid) {
        return bookDao.listByCategory(categoryid);
    }


    @GetMapping(value = "/book/getlast", produces = "application/json")
    public Book getLastBook() {
        return bookDao.getLastBook();
    }

    @PostMapping(value = "/book/insert")
    @Override
    public String saveData(@RequestBody  Book book) {
        //checked logged user has permission for insert book record (check user authentication and authorization)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Book");
        if(!userPrivi.getPrivi_insert()){
            return "Book Save not completed : User haven't permission.";
        }
        // check duplicate for unique columns
        try {
            //set auto generated values
            book.setUpdatedprice(book.getInitialprice());
            book.setAddeddatetime(LocalDateTime.now());
            User loggeduser = userDao.getByUsername(authentication.getName());
            book.setAddeduserid(loggeduser.getId());
            // book no - B0000001
            book.setBookno(bookDao.getNextBookNo());
            bookDao.save(book);
            // check dependencies
            return "OK";

        }catch (Exception e){
            return "Book Save not completed."+e.getMessage();
        }
    }

    @PutMapping(value = "/book/update")
    @Override
    public String updateData(@RequestBody  Book book) {
        //checked loged user has permission for update Book record (check user authentication and authorization)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Book");
        if(!userPrivi.getPrivi_update()){
            return "Book Update not completed : User haven't permission.";
        }
        // check existence
        if(book.getId()==null){
            return "Book Update not completed : Book not exist.";
        }
        Book extBook=bookDao.getReferenceById(book.getId());
        if(extBook.getId()==null){
            return "Book Update not completed : Book not exist.";
        }

        //check duplicate for unique columns
        // no unique columns

        try {
            //set auto genereted value
            book.setUpdateddatetime(LocalDateTime.now());
            User loggeduser = userDao.getByUsername(authentication.getName());
            book.setUpdateduserid(loggeduser.getId());

            //operation
            bookDao.save(book);
            return "OK";

        }catch (Exception e){
            return "Book Update not completed : " + e.getMessage();
        }
    }

    @DeleteMapping(value = "/book/delete")
    @Override
    public String deleteData(@RequestBody  Book book) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi = authController.getPrivilegeByUserAndModule(authentication.getName(),"Book");
        if(!userPrivi.getPrivi_delete()){
            return "Book Delete not completed : User haven't permission.";
        }
        // check existence
        if(book.getId()==null){
            return "Book Delete not completed : Book not exist.";
        }
        Book extBook=bookDao.getReferenceById(book.getId());
        if(extBook.getId()==null){
            return "Book Delete not completed : Book not exist.";
        }
        try {
            //set auto generated values
            extBook.setDeleteddatetime(LocalDateTime.now());
            User loggeduser = userDao.getByUsername(authentication.getName());
            extBook.setDeleteduserid(loggeduser.getId());
            extBook.setBookstatus_id(bookStatusDao.getReferenceById(3));
            // operation
            bookDao.save(extBook);
            //bookDao.delete(extBook);
            //dependencies

            return "OK";
        }catch(Exception e){
            return "Book Delete not completed : "+e.getMessage();
        }
    }


	
}
