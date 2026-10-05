package lk.bookbarlibrary;

import lk.bookbarlibrary.privilege.dao.ModuleDao;
import lk.bookbarlibrary.privilege.dao.PrivilegeDao;
import lk.bookbarlibrary.privilege.entity.Module;
import lk.bookbarlibrary.privilege.entity.Privilege;
import lk.bookbarlibrary.user.dao.UserDao;
import lk.bookbarlibrary.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;


@RestController
public class AuthController {
    @Autowired
    private PrivilegeDao privilegeDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private ModuleDao moduleDao;

    @GetMapping(value = "/loggedusermodule")
    public List<Module> getModuleBYLoggedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser= userDao.getByUsername(authentication.getName());
        if(loggedUser.getRoles().stream().anyMatch(role->role.getName().equals("Admin"))){
            return new ArrayList<Module>();
        }else{
            return moduleDao.getModuleBYLoggedUser(loggedUser.getId());
        }

    }

    // for front end
    @GetMapping(value = "/userprivilegebymodule" , params = { "modulename"})
    public Privilege getPrivilegeByModule( @RequestParam("modulename") String modulename) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return getPrivilegeByUserAndModule(authentication.getName(), modulename);
    }


    //    @GetMapping(value = "/userprivilegebymodule/{module}")
    //    public Privilege getPrivilegeByModule( @PathVariable("modulename") String modulename) {
    //        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    //        return getPrivilegeByUserAndModule(authentication.getName(), modulename);
    //    }


    // for back end
    public Privilege getPrivilegeByUserAndModule(String username, String modulename) {
        Privilege privilege= new Privilege();

        if(username.equalsIgnoreCase("admin")){
            privilege.setPrivi_select(Boolean.TRUE);
            privilege.setPrivi_insert(Boolean.TRUE);
            privilege.setPrivi_update(Boolean.TRUE);
            privilege.setPrivi_delete(Boolean.TRUE);
        }else {
            String privi= privilegeDao.getPrivilegeByUserAndModule(username, modulename);
            System.out.println(privi);
            String[] privileges= privi.split(",");
            privilege.setPrivi_select(privileges[0].equals("1"));
            privilege.setPrivi_insert(privileges[1].equals("1"));
            privilege.setPrivi_update(privileges[2].equals("1"));
            privilege.setPrivi_delete(privileges[3].equals("1"));
        }
        System.out.println(privilege.toString());
        return privilege;
    }
}
