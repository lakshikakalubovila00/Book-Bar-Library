package lk.bookbarlibrary.membershiptype.contoller;

import lk.bookbarlibrary.membershiptype.dao.MembershiptypeCategoryDao;
import lk.bookbarlibrary.membershiptype.entity.MembershipTypeCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MembershipTypeCategoryController {
    @Autowired
    private MembershiptypeCategoryDao membershiptypeCategoryDao;

    @GetMapping(value = "/membershiptypecategory/alldata", produces = "application/json")
    public List<MembershipTypeCategory> getAllMembershipTypeCategory() {
        return membershiptypeCategoryDao.findAll();
    }
}
