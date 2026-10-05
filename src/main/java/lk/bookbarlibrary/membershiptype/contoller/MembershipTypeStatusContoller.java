package lk.bookbarlibrary.membershiptype.contoller;
import lk.bookbarlibrary.membershiptype.dao.MembershipTypeStatusDao;
import lk.bookbarlibrary.membershiptype.entity.MembershipTypeStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MembershipTypeStatusContoller {
@Autowired
    private MembershipTypeStatusDao membershipTypeStatusDao;

    @GetMapping(value = "/membershiptypestatus/alldata", produces = "application/json")
    public List<MembershipTypeStatus> getAllMembershipTypeStatus() {
        return membershipTypeStatusDao.findAll();
    }
}
