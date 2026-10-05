package lk.bookbarlibrary.membership.dao;

import jakarta.validation.constraints.NotNull;
import lk.bookbarlibrary.membership.entity.Membership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MembershipDao extends JpaRepository<Membership,Integer> {

    @Query(value = "select m from Membership m where m.id=(select max(m.id)from Membership m where m.member_id.id=?1)")
    Membership filterbymemberid(Integer memberid);
    //DESC--descending order (highest ID first)

    @Query(value="SELECT coalesce(lpad(max(m.membershipno)+1,12,'0'),'000000000001') FROM bookbarlibrary.membership as m;" , nativeQuery= true)
    @NotNull String getNextMembershipNo();

    @Query(value = "select m from Membership m where ((m.enddate is not null and m.enddate <current_date )) and m.membershipstatus_id.id  in(5) ")
    List<Membership> getExpiredMemberships();

    @Query(value = "select m from Membership m where m.membershipstatus_id.id  in(6) ")
    List<Membership> getStatusExpiredMemberships();
}
