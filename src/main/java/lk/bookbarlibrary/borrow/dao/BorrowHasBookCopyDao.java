package lk.bookbarlibrary.borrow.dao;

import lk.bookbarlibrary.borrow.entity.BorrowHasBookCopy;
import lk.bookbarlibrary.membership.entity.Membership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

public interface BorrowHasBookCopyDao extends JpaRepository<BorrowHasBookCopy,Integer> {

    @Query( value = "SELECT bhbc FROM BorrowHasBookCopy bhbc  WHERE bhbc.borrow_id.member_id.id= ?1 AND (bhbc.borrowhasbookcopystatus_id.id in(1,2,4))")
    List<BorrowHasBookCopy> getBorrowedBookCopiesByMember(Integer memberId);


    @Query( value = "SELECT bhbc FROM BorrowHasBookCopy bhbc  WHERE bhbc.borrow_id.borrowcode = ?1 ")
    List<BorrowHasBookCopy> getBorrowedBookCopiesByBorrowcode(String borrowcode);
    

    @Query( value = "SELECT bhbc FROM BorrowHasBookCopy bhbc  WHERE bhbc.borrow_id.member_id.id = ?1 AND bhbc.borrowhasbookcopystatus_id.id=3")
    List<BorrowHasBookCopy> getHandoveredBookCopiesByMember(Integer memberid);

    @Query( value = "SELECT bhbc FROM BorrowHasBookCopy bhbc where bhbc.borrowhasbookcopystatus_id.id=3")
    List<BorrowHasBookCopy> getHandoveredBooks();

    @Query( value = "SELECT bhbc FROM BorrowHasBookCopy bhbc where bhbc.borrowhasbookcopystatus_id.id=2")
    List<BorrowHasBookCopy> getRenewedBooks();

    @Query( value = "SELECT bhbc FROM BorrowHasBookCopy bhbc  WHERE bhbc.borrow_id.member_id.id=?1 AND bhbc.borrowhasbookcopystatus_id.id=1 ")
    List<BorrowHasBookCopy> getBorrowedOnlyBookCopiesByMember(Integer memberid);

    @Query(value = "select bhbc from BorrowHasBookCopy bhbc where bhbc.bookcopy_id.id=?1 and  bhbc.borrowhasbookcopystatus_id.id in(1,2)")
    BorrowHasBookCopy getBorrowHasBookCopyByBookCopyId(Integer bookcopyid);

    @Query(value = "select count(bhbc.id) from BorrowHasBookCopy bhbc where bhbc.borrowhasbookcopystatus_id.id in(1,2,4) ")
    Integer getBorrowingsCount();

    @Query(value = "select count(bhbc.id) from BorrowHasBookCopy bhbc where ((bhbc.renewhandoverduedate is not null and bhbc.renewhandoverduedate <current_date )or ( bhbc.renewhandoverduedate is null and bhbc.borrow_id.handoverduedate < current_date)) and bhbc.borrowhasbookcopystatus_id.id in(4) ")
    Integer getOverdueCount();

    @Query(value = "select bhbc from BorrowHasBookCopy bhbc where ((bhbc.renewhandoverduedate is not null and bhbc.renewhandoverduedate <current_date )or ( bhbc.renewhandoverduedate is null and bhbc.borrow_id.handoverduedate < current_date)) and bhbc.borrowhasbookcopystatus_id.id in(1,2) ")
    List<BorrowHasBookCopy> getOverdueBooks();

    @Query( value = "SELECT bhbc FROM BorrowHasBookCopy bhbc where bhbc.borrowhasbookcopystatus_id.id in (1,2,4)")
    List<BorrowHasBookCopy> geCurrentBorrowings();

    @Query( value = "SELECT bhbc FROM BorrowHasBookCopy bhbc where bhbc.borrowhasbookcopystatus_id.id in (4)")
    List<BorrowHasBookCopy> getStatusOverdueBorrowedBooks();
}
