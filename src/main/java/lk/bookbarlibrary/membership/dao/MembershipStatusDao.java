package lk.bookbarlibrary.membership.dao;

import lk.bookbarlibrary.membership.entity.MembershipStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MembershipStatusDao extends JpaRepository<MembershipStatus,Integer> {

}
