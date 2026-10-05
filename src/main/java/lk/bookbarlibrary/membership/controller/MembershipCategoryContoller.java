package lk.bookbarlibrary.membership.controller;

import lk.bookbarlibrary.membership.dao.MembershipCategoryDao;
import lk.bookbarlibrary.membership.entity.MembershipCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MembershipCategoryContoller {
@Autowired
    private MembershipCategoryDao membershipCategoryDao;
@GetMapping(value = "/membershipcategory/alldata" , produces = "application/json")
    public List<MembershipCategory> getAllMembershipCategory(){
    return membershipCategoryDao.findAll();
    }
}
