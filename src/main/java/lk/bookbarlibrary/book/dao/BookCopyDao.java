package lk.bookbarlibrary.book.dao;

import lk.bookbarlibrary.book.entity.BookCopy;
import lk.bookbarlibrary.membership.entity.Membership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BookCopyDao extends JpaRepository<BookCopy,Integer> {

    @Query(value = "SELECT coalesce(concat('C',lpad(substring(max(bc.copyno),2)+1,3,'0')),'C001') From BookCopy bc where bc.book_id=?1;", nativeQuery = true)
    String getNextBookCopyNo(Integer bookId);

    @Query(value = "SELECT concat( (SELECT b.bookno FROM Book b), " + "(SELECT bc.copyno FROM BookCopy bc) )", nativeQuery = true)
    String getAccessionNo();

    @Query(value = "select bc from BookCopy bc where bc.accessionno=?1")
    BookCopy getBookCopyByAccesionNo(String accessionno);

    @Query(value = "select bc from BookCopy bc where bc.accessionno=?1 and bc.bookcopystatus_id.id=1 and bc.damagestatus_id.id not in (3,4)")
    BookCopy getAvailableBookCopyForBorrowByAccesionNo(String accessionno);

    @Query(value = "select bc from BookCopy bc where bc.accessionno=?1 and bc.bookcopystatus_id.id in (2,3,4)")
    BookCopy getNotAvailableBookCopyForBorrowByAccesionNo(String accessionno);

    @Query(value = "select bc from BookCopy bc where bc.id=(select max(bc.id)from BookCopy bc where bc.acquisitionmethod_id.id=1 and bc.book_id.id=?1)")
    BookCopy getLastPurchasedBookCopyByBook(Integer bookid);

    @Query(value = "select bc from BookCopy bc where bc.accessionno=?1 and bc.bookcopystatus_id.id in(1,2) and bc.damagestatus_id.id not in (3,4)")
    BookCopy getBookCopyForReservationByAccesionNo(String accessionno);

    @Query(value = "select bc from BookCopy bc where bc.accessionno=?1 and bc.bookcopystatus_id.id not in (1)")
    BookCopy getNotAvailableBookCopyForReservationByAccesionNo(String accessionno);

    @Query(value = "select bc from BookCopy bc where bc.book_id.title=?1 and bc.bookcopystatus_id.id not in (4)")
    List<BookCopy> getBookCopiesByTitle(String title);

    @Query(value = "select bc from BookCopy bc where bc.book_id.author=?1 and bc.bookcopystatus_id.id not in (4)")
    List<BookCopy> getAllBookCopiessByAuthor(String author);

    @Query(value = "select bc from BookCopy bc where bc.book_id.isbn=?1 and bc.bookcopystatus_id.id not in (4)")
    List<BookCopy> getAllBookCopiessByISBN(String isbn);

    @Query(value = "select bc from BookCopy bc where bc.book_id.issn=?1 and bc.bookcopystatus_id.id not in (4)")
    List<BookCopy> getAllBookCopiessByISSN(String issn);

    @Query(value = "select bc from BookCopy bc where bc.book_id.seriestitle=?1 and bc.bookcopystatus_id.id not in (4)")
    List<BookCopy> getAllBookCopiessBySeries(String series);

    @Query(value = "select bc from BookCopy bc where bc.book_id.displaycategory_id.name=?1 and bc.bookcopystatus_id.id not in (4)")
    List<BookCopy> getAllBookCopiessByDisplayCategory(String displaycategory);

    @Query(value = "SELECT COUNT(bc.id) FROM BookCopy bc")
    int getBookCopiesCount();

    @Query(value = "select bc from BookCopy bc where bc.book_id.id=?1 and bc.bookcopystatus_id.id in(1,2) and bc.damagestatus_id.id not in (3,4)")
    List<BookCopy> filterBookCopiesByBook(Integer bookid);

    @Query(value = "SELECT bc FROM BookCopy bc order by bc.id desc")
    List<BookCopy> findAllOrderByDesc();
}
