package lk.bookbarlibrary.donation.controller;

import jakarta.transaction.Transactional;
import lk.bookbarlibrary.AuthController;
import lk.bookbarlibrary.CommonController;
import lk.bookbarlibrary.book.dao.*;
import lk.bookbarlibrary.book.entity.Book;
import lk.bookbarlibrary.book.entity.BookCopy;
import lk.bookbarlibrary.donation.dao.DonationDao;
import lk.bookbarlibrary.donation.dao.DonationStatusDao;
import lk.bookbarlibrary.donation.entity.Donation;
import lk.bookbarlibrary.donation.entity.DonationHasBook;
import lk.bookbarlibrary.donation.entity.DonationStatus;
import lk.bookbarlibrary.privilege.entity.Privilege;
import lk.bookbarlibrary.user.dao.UserDao;
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
public class DonationController implements CommonController<Donation> {

    @Autowired
    private DonationDao  donationDao;

    @Autowired
    private AuthController authController;

    @Autowired
    private UserDao userDao;

    @Autowired
    private DonationStatusDao donationStatusDao;

    @Autowired
    private BookCopyDao bookCopyDao;

    @Autowired
    private AcquisitionMethodDao acquisitionMethodDao;

    @Autowired
    private BookCopyStatusDao  bookCopyStatusDao;

    @Autowired
    private DamageStatusDao damageStatusDao;

    @Autowired
    private BookStatusDao bookStatusDao;

    @Autowired
    private BookDao bookDao;

    @Override
    @RequestMapping(value="/donation")
    public ModelAndView getUi() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView donationView = new ModelAndView();
        donationView.addObject("loggedusername" , authentication.getName());
        donationView.addObject("title" , "Donation Management");
        donationView.setViewName("donation.html");
        return donationView;
    }

    @Override
    @GetMapping(value = "/donation/alldata", produces = "application/json")
    public List<Donation> findAllData() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi= authController.getPrivilegeByUserAndModule(authentication.getName(),"Donation");
        if(userPrivi.getPrivi_select()){
            return donationDao.findAll();
        }else {
            return new ArrayList<>();
        }
    }

    // create mapping for get donation object by using given id (path variable)
    @GetMapping(value = "/donation/byid/{donationid}", produces = "application/json")
    public Donation getDonationById(@PathVariable Integer donationid){
        return donationDao.getReferenceById(donationid);
    }

    @Transactional
    @Override
    @PostMapping(value = "/donation/insert")
    public String saveData(@RequestBody Donation donation) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi= authController.getPrivilegeByUserAndModule(authentication.getName(),"Donation");
        if(!userPrivi.getPrivi_insert()){
            return "Donation save not completed : User haven't permission.";
        }
        try{
            // check dependencies

            // set added date time
            donation.setAddeddatetime(LocalDateTime.now());
            // set user id
            donation.setAddeduserid(userDao.getByUsername(authentication.getName()).getId());
            //set code
            donation.setDonationcode(donationDao.getNextCodeNo());
            System.out.println(donation);

            for(DonationHasBook dhb : donation.getDonationHasBookList()){
                dhb.setDonation_id(donation);
                // get the donated quantity
                int quantity = dhb.getQuantity();
                // donated book
                Book book = bookDao.getReferenceById(dhb.getBook_id().getId()); // safer
                book.setBookstatus_id(bookStatusDao.getReferenceById(1));
                bookDao.save(book);

                for(int i=0; i<quantity; i++){
                    BookCopy bookCopy = new BookCopy();

                    // set book id
                    bookCopy.setBook_id(book);

                    // generate copy no
                    String copyNo=bookCopyDao.getNextBookCopyNo(book.getId());
                    bookCopy.setCopyno(copyNo);

                    // generate accession no
                    String accessionNo= book.getBookno()+ copyNo;
                    bookCopy.setAccessionno(accessionNo);

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
                    bookCopy.setAcquisitionmethod_id(acquisitionMethodDao.getReferenceById(2));

                    // acquisition date
                    bookCopy.setAcquisitiondate(LocalDate.now());

                    bookCopy.setAddeddatetime(LocalDateTime.now());
                    bookCopy.setAddeduserid(userDao.getByUsername(authentication.getName()).getId());

                    bookCopyDao.save(bookCopy);
                }
            }
        // operator
            donationDao.save(donation);
            return "OK";
        }catch(Exception e){
            return "Donation insert not completed."+e.getMessage();
        }
    }

    @Override
    @PutMapping(value = "/donation/update")
    public String updateData(@RequestBody Donation donation) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi= authController.getPrivilegeByUserAndModule(authentication.getName(),"Donation");
        if(!userPrivi.getPrivi_update()){
            return "Donation update not completed : User haven't permission.";
        }
        // check existence
        // get id from object
        if(donation.getId()==null){
            return "Donation update not completed : Donation not exist.";
        }
        // get id from database check this purchase order is existing
        Donation extDonation= donationDao.getReferenceById(donation.getId());
        if(extDonation.getId()==null){
            return "Donation update not completed : Donation not exist.";
        }
        try{
            // set updated date time
            donation.setUpdateddatetime(LocalDateTime.now());
            // set user id
            donation.setUpdateduserid(userDao.getByUsername(authentication.getName()).getId());

            for(DonationHasBook dhb : donation.getDonationHasBookList()){
                dhb.setDonation_id(donation);
            }
            // operator
            donationDao.save(donation);
            return "OK";
        }catch (Exception e){
            return "Donation update not completed."+e.getMessage();
        }

    }

    @Override
    @DeleteMapping(value = "/donation/delete")
    public String deleteData(@RequestBody Donation donation) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi= authController.getPrivilegeByUserAndModule(authentication.getName(),"Donation");
        if(!userPrivi.getPrivi_delete()){
            return "Donation delete not completed : User haven't permission.";
        }
        // check existence
        // get id from object
        if(donation.getId()==null){
            return "Donation delete not completed : Donation not exist.";
        }
        // get id from database check this purchase order is existing
        Donation extDonation= donationDao.getReferenceById(donation.getId());
        if(extDonation.getId()==null){
            return "Donation delete not completed : Donation not exist.";
        }
        try{
            // set deleted date time
            extDonation.setDeleteddatetime(LocalDateTime.now());
            // set user id
            extDonation.setDeleteduserid(userDao.getByUsername(authentication.getName()).getId());

            // change status
            extDonation.setDonationstatus_id(donationStatusDao.getReferenceById(2));

            //operator
            donationDao.save(extDonation);
            return "OK";
        }
        catch(Exception e){
            return "Donation delete not completed."+e.getMessage();
        }
    }


}
