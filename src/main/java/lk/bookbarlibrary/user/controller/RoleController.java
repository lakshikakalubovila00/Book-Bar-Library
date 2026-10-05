package lk.bookbarlibrary.user.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import lk.bookbarlibrary.user.dao.RoleDao;
import lk.bookbarlibrary.user.entity.Role;

@RestController
public class RoleController {
    
@Autowired
    private RoleDao roleDao;

    //create get mapping for get role all data [URL="role/alldata"]
    @GetMapping(value="/role/alldata" , produces = "application/json")
    public List<Role> getRoleAllData() {
        return roleDao.findAll();
    }

    
    //create get mapping for get role data without admin [URL="role/listwithoutadmin"]
    @GetMapping(value="/role/alldatawithoutadmin" , produces = "application/json")
    public List<Role> getListWithoutAdmin() {
        return roleDao.listwithoutadmin();
    }

    //
    @GetMapping(value = "/role/byuser/{userid}", produces = "application/json")
    public List<Role> getRoleByUserId(@PathVariable("userid") Integer userid) {
        return roleDao.getRoleByUserId(userid);

    }

}
