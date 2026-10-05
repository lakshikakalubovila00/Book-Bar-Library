package lk.bookbarlibrary.membership.dao;

import lk.bookbarlibrary.membership.entity.MembershipCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MembershipCategoryDao extends JpaRepository<MembershipCategory,Integer> {

}
