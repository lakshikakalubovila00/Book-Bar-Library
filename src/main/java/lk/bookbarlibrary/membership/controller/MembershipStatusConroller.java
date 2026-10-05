package lk.bookbarlibrary.membership.controller;

import lk.bookbarlibrary.membership.dao.MembershipStatusDao;
import lk.bookbarlibrary.membership.entity.MembershipStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
// handles REST API requests and returns data
// cannot use these implemented methods . add these to indexing table
public class MembershipStatusConroller {

@Autowired
private MembershipStatusDao membershipStatusDao;
@GetMapping(value = "/membershipstatus/alldata", produces = "application/json")
    public List<MembershipStatus> getAllMembershipStatus(){
    return membershipStatusDao.findAll();
}
}
