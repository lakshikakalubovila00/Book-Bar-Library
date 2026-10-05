package lk.bookbarlibrary.report;

import lk.bookbarlibrary.user.dao.UserDao;
import lk.bookbarlibrary.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class ReportUIController {

    @Autowired
    private UserDao userDao;

    @GetMapping(value = "/reportportal")
    public ModelAndView getReportPortalUI(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser= userDao.getByUsername(authentication.getName());

        ModelAndView reportPortalView = new ModelAndView();
        reportPortalView.addObject("loggedusername" , authentication.getName());
        reportPortalView.addObject("title", "Report Portal");
        reportPortalView.setViewName("reportportal.html");
        return reportPortalView;
    }


    @GetMapping(value = "/reportpurchasebookui")
    public ModelAndView getReportPurchaseBookUI(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser= userDao.getByUsername(authentication.getName());

        ModelAndView reportPurchaseBookView = new ModelAndView();
        reportPurchaseBookView.addObject("loggedusername" , authentication.getName());
        reportPurchaseBookView.addObject("title", "Book Purchase Report");
        reportPurchaseBookView.setViewName("reportpurchaseBook.html");
        return reportPurchaseBookView;
    }

    @GetMapping(value = "/reportborrowingbookui")
    public ModelAndView getReportBorrowingBookUI(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser= userDao.getByUsername(authentication.getName());

        ModelAndView reportBorrowingBookView = new ModelAndView();
        reportBorrowingBookView.addObject("loggedusername" , authentication.getName());
        reportBorrowingBookView.addObject("title", "Book Borrowing Report");
        reportBorrowingBookView.setViewName("reportborrowings.html");
        return reportBorrowingBookView;
    }

    @GetMapping(value = "/reportmostborrowedbooksui")
    public ModelAndView getReportMostBorrowedBooksUI(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser= userDao.getByUsername(authentication.getName());

        ModelAndView reportMostBorrowedBooksView = new ModelAndView();
        reportMostBorrowedBooksView.addObject("loggedusername" , authentication.getName());
        reportMostBorrowedBooksView.addObject("title", "Most Borrowed Books Report");
        reportMostBorrowedBooksView.setViewName("reportmostborrowedbooks.html");
        return reportMostBorrowedBooksView;
    }

    @GetMapping(value = "/reportbookcategoryui")
    public ModelAndView getReportBookCategoryUI(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser= userDao.getByUsername(authentication.getName());

        ModelAndView reportBookCategoryView = new ModelAndView();
        reportBookCategoryView.addObject("loggedusername" , authentication.getName());
        reportBookCategoryView.addObject("title", "Book Category Report");
        reportBookCategoryView.setViewName("reportbookcategory.html");
        return reportBookCategoryView;
    }

    @GetMapping(value = "/reportbookstatusui")
    public ModelAndView getReportBookStatusUI(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser= userDao.getByUsername(authentication.getName());

        ModelAndView reportBookStatusView = new ModelAndView();
        reportBookStatusView.addObject("loggedusername" , authentication.getName());
        reportBookStatusView.addObject("title", "Book Status Report");
        reportBookStatusView.setViewName("reportbookstatus.html");
        return reportBookStatusView;
    }

    @GetMapping(value = "/reportbookborrowingbycategoryui")
    public ModelAndView getReportBookBorrowingByCategoryUI(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser= userDao.getByUsername(authentication.getName());

        ModelAndView reportBookBorrowingByCategoryView = new ModelAndView();
        reportBookBorrowingByCategoryView.addObject("loggedusername" , authentication.getName());
        reportBookBorrowingByCategoryView.addObject("title", "Book Borrowing Report by Category");
        reportBookBorrowingByCategoryView.setViewName("reportbookborrowingsbycategory.html");
        return reportBookBorrowingByCategoryView;
    }
}
