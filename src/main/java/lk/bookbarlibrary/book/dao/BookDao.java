package lk.bookbarlibrary.book.dao;

import jakarta.validation.constraints.NotNull;
import lk.bookbarlibrary.book.entity.Book;
import org.hibernate.validator.constraints.Length;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookDao extends JpaRepository<Book,Integer> {

    @Query(value = "SELECT coalesce(concat('B',lpad(substring(max(b.bookno),2)+1,7,'0')),'B0000001') From Book b;", nativeQuery = true)
    String getNextBookNo();

    @Query(value = "select new Book (b.id, b.bookno, b.title,b.updatedprice)from Book b where b.bookstatus_id.id=1 or b.bookstatus_id.id=2")
    //where b.bookstatus_id.id=1 or b.bookstatus_id.id=2
    // available and not available
    // i only have those 2
    List<Book> list();

    @Query(value = "select new Book (b.id, b.bookno, b.title ,b.updatedprice)from Book b where" +
            " (b.bookstatus_id.id=1 or b.bookstatus_id.id=2) and b.id not in" +
            "(select shb.book_id.id from SupplierHasBook shb where shb.supplier_id.id=?1)")
    List<Book> listWithoutSupply(Integer supplierid);

    @Query(value = "select new Book (b.id, b.bookno, b.title, b.updatedprice)from Book b where " +
            "(b.bookstatus_id.id=1 or b.bookstatus_id.id=2) and b.displaycategory_id.id=?1")
    List<Book> listByCategory(Integer categoryid);

    @Query(value = "select new Book (b.id, b.bookno, b.title, b.updatedprice)from Book b where" +
            " (b.bookstatus_id.id=1 or b.bookstatus_id.id=2) and b.id in" +
            "(select shb.book_id.id from SupplierHasBook shb where shb.supplier_id.id=?1)")
    List<Book> getBookListBySupplier(Integer supplierid);


    @Query(value = "SELECT * FROM Book ORDER BY id DESC LIMIT 1", nativeQuery = true)
    Book getLastBook();


    @Query(value = "select new Book (b.id, b.bookno, b.title, b.updatedprice) from Book b where" +
            " (b.bookstatus_id.id=1 or b.bookstatus_id.id=2) and b.id in" +
            "(select phb.book_id.id from PurchaseHasBook phb where phb.purchase_id.id=?1)")
    List<Book> getBookListByPurchaseOrder(Integer purchaseid);


    // distinct - remove duplicate values

    @Query(value = "select distinct  b.author from Book b where b.author is not null")
    List<String> findAllAuthors();

    @Query(value = "select distinct  b.publisher from Book b where b.publisher is not null")
    List<String> findAllPublishers();

    @Query(value = "select  distinct b.seriestitle from Book b where b.seriestitle is not null")
    List<String> findAllSeries();

    @Query(value = "select distinct  b.title from Book b where b.title is not null")
    List<String> findAllTitles();

    @Query(value = "select distinct  b.isbn from Book b where b.isbn is not null")
    List<String> findAllISBSNs();

    @Query(value = "select distinct  b.issn from Book b where b.issn is not null")
    List<String> findAllISSNs();

    @Query(value = "select distinct  b.displaycategory_id.name from Book b where b.displaycategory_id.name is not null")
    List<String> findAllDisplayCategories();

    // ASC = Ascending order (small - large, A - Z)
    // DESC = Descending order (large - small, Z - A)
    @Query(value = "select b from Book b order by b.id desc")
    List<Book> findAllDataByOrderDesc();
}
