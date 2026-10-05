package lk.bookbarlibrary.report;

import lk.bookbarlibrary.employee.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReportDao extends JpaRepository<Employee, Integer> {

    @Query(value = "select * from bookbarlibrary.employee as e where e.designation_id=?1;", nativeQuery = true)
    List<Employee> getEmployeeByDesignation(Integer designationid);

    @Query(value = "SELECT monthname(po.addeddatetime), sum(pohb.quantity) FROM bookbarlibrary.purchase as po inner join bookbarlibrary.purchase_has_book as pohb on po.id=pohb.purchase_id\n" +
            "where pohb.book_id=?1 and date(po.addeddatetime) between ?2 and ?3 group by monthname(po.addeddatetime) ;" ,nativeQuery = true)
    public List getBookPurchaseCountByPurchasedDateMonthly(Integer bookid , String sdate, String edate);

    @Query(value = "SELECT week(po.addeddatetime), sum(pohb.quantity) FROM bookbarlibrary.purchase as po inner join bookbarlibrary.purchase_has_book as pohb on po.id=pohb.purchase_id\n" +
            "where pohb.book_id=?1 and date(po.addeddatetime) between ?2 and ?3 group by week(po.addeddatetime) ORDER BY WEEK(po.addeddatetime) ASC ;" ,nativeQuery = true)
    public List getBookPurchaseCountByPurchasedDateWeekly(Integer bookid , String sdate, String edate);

    @Query(value = "SELECT date(po.addeddatetime), sum(pohb.quantity) FROM bookbarlibrary.purchase as po inner join bookbarlibrary.purchase_has_book as pohb on po.id=pohb.purchase_id\n" +
            "where pohb.book_id=?1 and date(po.addeddatetime) between ?2 and ?3 group by date(po.addeddatetime) " ,nativeQuery = true)
    public List getBookPurchaseCountByPurchasedDateDaily(Integer bookid , String sdate, String edate);

    @Query(value = "SELECT year(po.addeddatetime), sum(pohb.quantity) FROM bookbarlibrary.purchase as po inner join bookbarlibrary.purchase_has_book as pohb on po.id=pohb.purchase_id\n" +
            "where pohb.book_id=?1 and date(po.addeddatetime) between ?2 and ?3 group by year(po.addeddatetime);" ,nativeQuery = true)
    public List getBookPurchaseCountByPurchasedDateYearly(Integer bookid , String sdate, String edate);

    @Query(value = "SELECT monthname(b.addeddatetime), count(*) FROM bookbarlibrary.borrow as b inner join bookbarlibrary.borrow_has_bookcopy as bhbc\n" +
            " on b.id=bhbc.borrow_id join bookbarlibrary.bookcopy as bc on bhbc.bookcopy_id=bc.id\n" +
            "where bc.book_id=?1 and date(b.addeddatetime) between ?2 and ?3 group by monthname(b.addeddatetime), month(b.addeddatetime) order by month(b.addeddatetime)" ,nativeQuery = true)
    public List getBorrowingBookCountMonthly(Integer bookid , String sdate, String edate);

    @Query(value = "SELECT week(b.addeddatetime), count(*) FROM bookbarlibrary.borrow as b inner join bookbarlibrary.borrow_has_bookcopy as bhbc\n" +
            " on b.id=bhbc.borrow_id join bookbarlibrary.bookcopy as bc on bhbc.bookcopy_id=bc.id\n" +
            "where bc.book_id=?1 and date(b.addeddatetime) between ?2 and ?3 group by week(b.addeddatetime)" ,nativeQuery = true)
    public List getBorrowingBookCountWeekly(Integer bookid , String sdate, String edate);

    @Query(value = "SELECT date(b.addeddatetime), count(*) FROM bookbarlibrary.borrow as b inner join bookbarlibrary.borrow_has_bookcopy as bhbc\n" +
            " on b.id=bhbc.borrow_id join bookbarlibrary.bookcopy as bc on bhbc.bookcopy_id=bc.id\n" +
            "where bc.book_id=?1 and date(b.addeddatetime) between ?2 and ?3 group by date(b.addeddatetime)" ,nativeQuery = true)
    public List getBorrowingBookCountDaily(Integer bookid , String sdate, String edate);

    @Query(value = "SELECT year(b.addeddatetime), count(*) FROM bookbarlibrary.borrow as b inner join bookbarlibrary.borrow_has_bookcopy as bhbc\n" +
            " on b.id=bhbc.borrow_id join bookbarlibrary.bookcopy as bc on bhbc.bookcopy_id=bc.id\n" +
            "where bc.book_id=?1 and date(b.addeddatetime) between ?2 and ?3 group by year(b.addeddatetime)" ,nativeQuery = true)
    public List getBorrowingBookCountYearly(Integer bookid , String sdate, String edate);

    @Query(value = "SELECT dc.name as category, COUNT(bc.id) as bookcount\n" +
            "FROM bookbarlibrary.displaycategory as dc\n" +
            "LEFT JOIN bookbarlibrary.book as b ON b.displaycategory_id = dc.id\n" +
            "LEFT JOIN bookbarlibrary.bookcopy as bc ON bc.book_id = b.id\n" +
            "GROUP BY dc.id, dc.name\n" +
            "ORDER BY dc.name;" , nativeQuery = true)
    List getBookCategoryData();

    @Query(value = "SELECT bcs.name as category, COUNT(bc.id) as bookcount\n" +
            "FROM bookbarlibrary.bookcopystatus as bcs\n" +
            "LEFT JOIN bookbarlibrary.bookcopy as bc ON bc.bookcopystatus_id = bcs.id\n" +
            "GROUP BY bcs.id, bcs.name\n" +
            "ORDER BY bcs.name;" , nativeQuery = true)
    List getBookStatusData();

    @Query(value = "SELECT monthname(b.addeddatetime), count(*) FROM bookbarlibrary.borrow as b inner join bookbarlibrary.borrow_has_bookcopy as bhbc\n" +
            " on b.id=bhbc.borrow_id join bookbarlibrary.bookcopy as bc on bhbc.bookcopy_id=bc.id\n" +
            " left join bookbarlibrary.book as book on bc.book_id=book.id\n" +
            " join bookbarlibrary.displaycategory as dc on book.displaycategory_id=dc.id\n" +
            " where dc.id=?1 and date(b.addeddatetime) between ?2 and ?3 \n" +
            " group by monthname(b.addeddatetime), month(b.addeddatetime) order by month(b.addeddatetime)", nativeQuery = true)
    List getBorrowingBookCountByCategoryMonthly(Integer displaycategoryid, String sdate, String edate);

    @Query(value = "SELECT week(b.addeddatetime), count(*) FROM bookbarlibrary.borrow as b inner join bookbarlibrary.borrow_has_bookcopy as bhbc\n" +
            " on b.id=bhbc.borrow_id join bookbarlibrary.bookcopy as bc on bhbc.bookcopy_id=bc.id\n" +
            " left join bookbarlibrary.book as book on bc.book_id=book.id\n" +
            " join bookbarlibrary.displaycategory as dc on book.displaycategory_id=dc.id\n" +
            " where dc.id=?1 and date(b.addeddatetime) between ?2 and ?3 \n" +
            " group by monthname(b.addeddatetime), week(b.addeddatetime) order by week(b.addeddatetime)", nativeQuery = true)
    List getBorrowingBookCountByCategoryWeekly(Integer displaycategoryid, String sdate, String edate);


    @Query(value = "SELECT date(b.addeddatetime), count(*) FROM bookbarlibrary.borrow as b inner join bookbarlibrary.borrow_has_bookcopy as bhbc\n" +
            " on b.id=bhbc.borrow_id join bookbarlibrary.bookcopy as bc on bhbc.bookcopy_id=bc.id\n" +
            " left join bookbarlibrary.book as book on bc.book_id=book.id\n" +
            " join bookbarlibrary.displaycategory as dc on book.displaycategory_id=dc.id\n" +
            " where dc.id=?1 and date(b.addeddatetime) between ?2 and ?3 \n" +
            " group by monthname(b.addeddatetime), date(b.addeddatetime) order by date(b.addeddatetime)", nativeQuery = true)
    List getBorrowingBookCountByCategoryDaily(Integer displaycategoryid, String sdate, String edate);

    @Query(value = "SELECT year(b.addeddatetime), count(*) FROM bookbarlibrary.borrow as b inner join bookbarlibrary.borrow_has_bookcopy as bhbc\n" +
            " on b.id=bhbc.borrow_id join bookbarlibrary.bookcopy as bc on bhbc.bookcopy_id=bc.id\n" +
            " left join bookbarlibrary.book as book on bc.book_id=book.id\n" +
            " join bookbarlibrary.displaycategory as dc on book.displaycategory_id=dc.id\n" +
            " where dc.id=?1 and date(b.addeddatetime) between ?2 and ?3 \n" +
            " group by monthname(b.addeddatetime), year(b.addeddatetime) order by year(b.addeddatetime)", nativeQuery = true)
    List getBorrowingBookCountByCategoryYearly(Integer displaycategoryid, String sdate, String edate);

    @Query(value = "SELECT b.title, monthname(br.addeddatetime), count(*) as borrowcount " +
            "FROM bookbarlibrary.borrow_has_bookcopy bhbc " +
            "join bookbarlibrary.borrow br on bhbc.borrow_id=br.id " +
            "join bookbarlibrary.bookcopy bc on  bhbc.bookcopy_id=bc.id " +
            "join bookbarlibrary.book b on bc.book_id=b.id " +
            "where date(br.addeddatetime) between ?1 and ?2 " +
            "group by b.title, monthname(br.addeddatetime), month(br.addeddatetime) order by borrowcount desc limit 10",nativeQuery = true)
    List getMostBorrowedBooksMonthly(String sdate, String edate);

    @Query(value = "SELECT b.title, week(br.addeddatetime), count(*)  as borrowcount" +
            "FROM bookbarlibrary.borrow_has_bookcopy bhbc " +
            "join bookbarlibrary.borrow br on bhbc.borrow_id=br.id " +
            "join bookbarlibrary.bookcopy bc on  bhbc.bookcopy_id=bc.id " +
            "join bookbarlibrary.book b on bc.book_id=b.id " +
            "where date(br.addeddatetime) between ?1 and ?2 " +
            "group by b.title, monthname(br.addeddatetime), week(br.addeddatetime) order by borrowcount desc limit 10",nativeQuery = true)
    List getMostBorrowedBooksWeekly(String sdate, String edate);

    @Query(value = "SELECT b.title, date(br.addeddatetime), count(*) as borrowcount " +
            "FROM bookbarlibrary.borrow_has_bookcopy bhbc " +
            "join bookbarlibrary.borrow br on bhbc.borrow_id=br.id " +
            "join bookbarlibrary.bookcopy bc on  bhbc.bookcopy_id=bc.id " +
            "join bookbarlibrary.book b on bc.book_id=b.id " +
            "where date(br.addeddatetime) between ?1 and ?2 " +
            "group by b.title, monthname(br.addeddatetime), date(br.addeddatetime) order by borrowcount desc limit 10",nativeQuery = true)
    List getMostBorrowedBooksDaily(String sdate, String edate);

    @Query(value = "SELECT b.title, year(br.addeddatetime), count(*) as borrowcount " +
            "FROM bookbarlibrary.borrow_has_bookcopy bhbc " +
            "join bookbarlibrary.borrow br on bhbc.borrow_id=br.id " +
            "join bookbarlibrary.bookcopy bc on  bhbc.bookcopy_id=bc.id " +
            "join bookbarlibrary.book b on bc.book_id=b.id " +
            "where date(br.addeddatetime) between ?1 and ?2 " +
            "group by b.title, monthname(br.addeddatetime), year(br.addeddatetime) order by borrowcount desc limit 10",nativeQuery = true)
    List getMostBorrowedBooksYearly(String sdate, String edate);


    @Query(value = "SELECT b.title, monthname(br.addeddatetime), count(*) as borrowcount " +
            "FROM bookbarlibrary.borrow_has_bookcopy bhbc " +
            "join bookbarlibrary.borrow br on bhbc.borrow_id=br.id " +
            "join bookbarlibrary.bookcopy bc on  bhbc.bookcopy_id=bc.id " +
            "join bookbarlibrary.book b on bc.book_id=b.id " +
            "join bookbarlibrary.displaycategory d on b.displaycategory_id=d.id "+
            "where d.id=?1 and date(br.addeddatetime) between ?2 and ?3 " +
            "group by b.title, monthname(br.addeddatetime), month(br.addeddatetime) order by borrowcount desc limit 10",nativeQuery = true)
    List getMostBorrowedBooksByCategoryMonthly(Integer categoryid, String sdate, String edate);

    @Query(value = "SELECT b.title, week(br.addeddatetime), count(*) as borrowcount " +
            "FROM bookbarlibrary.borrow_has_bookcopy bhbc " +
            "join bookbarlibrary.borrow br on bhbc.borrow_id=br.id " +
            "join bookbarlibrary.bookcopy bc on  bhbc.bookcopy_id=bc.id " +
            "join bookbarlibrary.book b on bc.book_id=b.id " +
            "join bookbarlibrary.displaycategory d on b.displaycategory_id=d.id "+
            "where d.id=?1 and date(br.addeddatetime) between ?2 and ?3 " +
            "group by b.title, monthname(br.addeddatetime), week(br.addeddatetime) order by borrowcount desc limit 10",nativeQuery = true)
    List getMostBorrowedBooksByCategoryWeekly(Integer categoryid, String sdate, String edate);

    @Query(value = "SELECT b.title, date (br.addeddatetime), count(*) as borrowcount " +
            "FROM bookbarlibrary.borrow_has_bookcopy bhbc " +
            "join bookbarlibrary.borrow br on bhbc.borrow_id=br.id " +
            "join bookbarlibrary.bookcopy bc on  bhbc.bookcopy_id=bc.id " +
            "join bookbarlibrary.book b on bc.book_id=b.id " +
            "join bookbarlibrary.displaycategory d on b.displaycategory_id=d.id "+
            "where d.id=?1 and date(br.addeddatetime) between ?2 and ?3 " +
            "group by b.title, monthname(br.addeddatetime), date(br.addeddatetime) order by borrowcount desc limit 10",nativeQuery = true)
    List getMostBorrowedBooksByCategoryDaily(Integer categoryid, String sdate, String edate);

    @Query(value = "SELECT b.title, year(br.addeddatetime), count(*) as borrowcount " +
            "FROM bookbarlibrary.borrow_has_bookcopy bhbc " +
            "join bookbarlibrary.borrow br on bhbc.borrow_id=br.id " +
            "join bookbarlibrary.bookcopy bc on  bhbc.bookcopy_id=bc.id " +
            "join bookbarlibrary.book b on bc.book_id=b.id " +
            "join bookbarlibrary.displaycategory d on b.displaycategory_id=d.id "+
            "where d.id=?1 and date(br.addeddatetime) between ?2 and ?3 " +
            "group by b.title, monthname(br.addeddatetime), year(br.addeddatetime) order by borrowcount desc limit 10",nativeQuery = true)
    List getMostBorrowedBooksByCategoryYearly(Integer categoryid, String sdate, String edate);
}
