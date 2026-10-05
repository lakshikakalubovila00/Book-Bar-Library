package lk.bookbarlibrary.report;

import lk.bookbarlibrary.employee.entity.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ReportController {

    @Autowired
    private ReportDao reportDao;

    // get employee data by designation (/report/databydesignation?designationid=1)
    @GetMapping(value = "/report/databydesignation", params = {"designationid"})
    public List<Employee> getEmployeeByDesignation(@RequestParam(name="designationid") Integer designationid) {
        return reportDao.getEmployeeByDesignation(designationid);

    }

    // get purchase book data by sdate, edate, and type (/report/purchasebookdatabysdateedatetype?bookid=38&sdate=2026-01-01&edate=2026-12-31&type=Monthly)
    @GetMapping(value = "/report/purchasebookdatabysdateedatetype", params = {"bookid","sdate","edate", "type"})
    public List getPurchaseBookDataBySDateEDateType(@RequestParam(name="bookid") Integer bookid,
                                                              @RequestParam(name="sdate") String sdate,
                                                              @RequestParam(name="edate") String edate,
                                                              @RequestParam(name="type") String type) {
        if(type.equals("Monthly")){
            return reportDao.getBookPurchaseCountByPurchasedDateMonthly(bookid,sdate,edate);
        }
        if(type.equals("Weekly")){
            return reportDao.getBookPurchaseCountByPurchasedDateWeekly(bookid,sdate,edate);
        }
        if(type.equals("Daily")){
            return reportDao.getBookPurchaseCountByPurchasedDateDaily(bookid,sdate,edate);
        }
        if(type.equals("Yearly")){
            return reportDao.getBookPurchaseCountByPurchasedDateYearly(bookid,sdate,edate);
        }
        return null;

    }

    // get borrowing book data by sdate, edate, and type (/report/borrowingbookdatabysdateedatetype?bookid=38&sdate=2026-01-01&edate=2026-12-31&type=Monthly)
    @GetMapping(value = "/report/borrowingbookdatabysdateedatetype", params = {"bookid","sdate","edate", "type"})
    public List getBorrowingBookDataBySDateEDateType(@RequestParam(name="bookid") Integer bookid,
                                                    @RequestParam(name="sdate") String sdate,
                                                    @RequestParam(name="edate") String edate,
                                                    @RequestParam(name="type") String type) {
        if(type.equals("Monthly")){
            return reportDao.getBorrowingBookCountMonthly(bookid,sdate,edate);
        }
        if(type.equals("Weekly")){
            return reportDao.getBorrowingBookCountWeekly(bookid,sdate,edate);
        }
        if(type.equals("Daily")){
            return reportDao.getBorrowingBookCountDaily(bookid,sdate,edate);
        }
        if(type.equals("Yearly")){
            return reportDao.getBorrowingBookCountYearly(bookid,sdate,edate);
        }
        return null;

    }

    // get borrowing book data by sdate, edate, and type (/report/mostborrowedbooksbysdateedatetype?sdate=2026-01-01&edate=2026-12-31&type=Monthly)
    @GetMapping(value = "/report/mostborrowedbooksbysdateedatetype", params = {"sdate","edate", "type"})
    public List getMostBorrowedBooksBySDateEDateType(@RequestParam(name="sdate") String sdate,
                                                     @RequestParam(name="edate") String edate,
                                                     @RequestParam(name="type") String type) {
        if(type.equals("Monthly")){
            return reportDao.getMostBorrowedBooksMonthly(sdate,edate);
        }
        if(type.equals("Weekly")){
            return reportDao.getMostBorrowedBooksWeekly(sdate,edate);
        }
        if(type.equals("Daily")){
            return reportDao.getMostBorrowedBooksDaily(sdate,edate);
        }
        if(type.equals("Yearly")){
            return reportDao.getMostBorrowedBooksYearly(sdate,edate);
        }
        return null;

    }

    // get most borrowed book data by sdate, edate, and type (/report/mostborrowedbooksbycategorysdateedatetype?sdate=2026-01-01&edate=2026-12-31&type=Monthly)
    @GetMapping(value = "/report/mostborrowedbooksbycategorysdateedatetype", params = {"categoryid","sdate","edate", "type"})
    public List getMostBorrowedBooksByCategorySDateEDateType(@RequestParam(name="categoryid") Integer categoryid,
                                                     @RequestParam(name="sdate") String sdate,
                                                     @RequestParam(name="edate") String edate,
                                                     @RequestParam(name="type") String type) {
        if(type.equals("Monthly")){
            return reportDao.getMostBorrowedBooksByCategoryMonthly(categoryid, sdate,edate);
        }
        if(type.equals("Weekly")){
            return reportDao.getMostBorrowedBooksByCategoryWeekly(categoryid,sdate,edate);
        }
        if(type.equals("Daily")){
            return reportDao.getMostBorrowedBooksByCategoryDaily(categoryid,sdate,edate);
        }
        if(type.equals("Yearly")){
            return reportDao.getMostBorrowedBooksByCategoryYearly(categoryid,sdate,edate);
        }
        return null;

    }

    // get book category (/report/bookcategorydata)
    @GetMapping(value = "/report/bookcategorydata")
    public List getBookCategoryData() {
        return reportDao.getBookCategoryData();

    }

    // get book category (/report/bookstatusdata)
    @GetMapping(value = "/report/bookstatusdata")
    public List getBookStatusData() {
        return reportDao.getBookStatusData();

    }

    // get borrowing book data by sdate, edate, and type (/report/borrowingbookdatabycategorybysdateedatetype?displaycategoryid=38&sdate=2026-01-01&edate=2026-12-31&type=Monthly)
    @GetMapping(value = "/report/borrowingbookdatabycategorybysdateedatetype", params = {"displaycategoryid","sdate","edate", "type"})
    public List getBorrowingBookDataByCategoryBySDateEDateType(@RequestParam(name="displaycategoryid") Integer displaycategoryid,
                                                     @RequestParam(name="sdate") String sdate,
                                                     @RequestParam(name="edate") String edate,
                                                     @RequestParam(name="type") String type) {
        if(type.equals("Monthly")){
            return reportDao.getBorrowingBookCountByCategoryMonthly(displaycategoryid,sdate,edate);
        }
        if(type.equals("Weekly")){
            return reportDao.getBorrowingBookCountByCategoryWeekly(displaycategoryid,sdate,edate);
        }
        if(type.equals("Daily")){
            return reportDao.getBorrowingBookCountByCategoryDaily(displaycategoryid,sdate,edate);
        }
        if(type.equals("Yearly")){
            return reportDao.getBorrowingBookCountByCategoryYearly(displaycategoryid,sdate,edate);
        }
        return null;

    }
}
