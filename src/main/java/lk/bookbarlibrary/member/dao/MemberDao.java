package lk.bookbarlibrary.member.dao;

import org.hibernate.validator.constraints.Length;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bookbarlibrary.member.entity.Member;

import java.util.List;

public interface MemberDao extends JpaRepository<Member, Integer> {

     @Query(value="select m from Member m where m.nic=?1")
    Member getByNic(String nic);
    @Query(value = "SELECT coalesce(concat('MEM', year(current_date()),lpad(substring(max(m.memberno),8)+1,5,'0')),concat('MEM', year(current_date()),'00001')) FROM Member m where year(current_date())=year(m.addeddatetime);", nativeQuery = true)
    String getNextMemberNo();

    @Query(value="select m from Member m where m.email=?1")
    Member getByEmail(String email);

    @Query(value="select m from Member m where m.mobileno=?1")
    Member getByMobileno( String mobileno);

    @Query(value="select m from Member m where m.memberno=?1")
    Member filterByMemberno(String memberno);

    @Query(value = "SELECT COUNT(m.id) FROM Member m")
    int getMembersCount();
}
