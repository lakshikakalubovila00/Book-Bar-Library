package lk.bookbarlibrary.member.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.bookbarlibrary.member.dao.MemberStatusDao;
import lk.bookbarlibrary.member.entity.MemberStatus;

@RestController
public class MemberStatusController {
    @Autowired
    private MemberStatusDao memberStatusDao;

    @GetMapping(value = "/memberstatus/alldata", produces = "application/json")
    public List<MemberStatus> getAllMemberStatusData() {
        return memberStatusDao.findAll();
    }
}
