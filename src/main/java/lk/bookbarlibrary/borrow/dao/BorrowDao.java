package lk.bookbarlibrary.borrow.dao;

import lk.bookbarlibrary.borrow.entity.Borrow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BorrowDao extends JpaRepository<Borrow,Integer> {

    // if there are no borrow records this year it will return null without coalesce
    @Query(value = "SELECT coalesce(concat(year(current_date()),lpad(substring(max(b.borrowcode),5)+1,8,'0')),concat(year(current_date()),'00000001')) FROM Borrow b where year(current_date())=year(b.borrowdate);", nativeQuery = true)
    String getNextBorrowCode();

    @Query(value = "SELECT COUNT(bhbc.id) FROM BorrowHasBookCopy bhbc WHERE bhbc.borrow_id.member_id.id=?1 AND bhbc.borrowhasbookcopystatus_id.id in (1,2,4)")
    Integer getBooksOnHandByMember(Integer memberid);

    @Query("SELECT b FROM Borrow b WHERE b.borrowcode = ?1")
    Borrow getBorrowsByBorrowcode(String borrowcode);

    @Query(value = "select b from Borrow b WHERE b.member_id.id =?1 AND b.fullfineamount > 0")
    List<Borrow> getByMember_id(Integer memberid);

}
