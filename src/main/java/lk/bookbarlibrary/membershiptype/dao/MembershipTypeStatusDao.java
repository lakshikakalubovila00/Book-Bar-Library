package lk.bookbarlibrary.membershiptype.dao;

import lk.bookbarlibrary.membershiptype.entity.MembershipTypeStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MembershipTypeStatusDao extends JpaRepository<MembershipTypeStatus,Integer> {

}
