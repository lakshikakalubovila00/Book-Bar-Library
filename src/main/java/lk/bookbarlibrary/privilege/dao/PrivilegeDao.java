package lk.bookbarlibrary.privilege.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bookbarlibrary.privilege.entity.Privilege;

public interface PrivilegeDao extends JpaRepository<Privilege,Integer> {

    @Query(value="select p from Privilege p where p.role_id.id=?1 and p.module_id.id=?2")
    Privilege getByRoleModule(Integer id, Integer id2);

    //get privilege by logged user and module name
    @Query(value = "SELECT bit_or(p.privi_select) as priselect, \n" +
            "bit_or(p.privi_insert) as priinsert, \n" +
            "bit_or(p.privi_update) as priupdate, \n" +
            "bit_or(p.privi_delete) as pridelete \n" +
            " FROM bookbarlibrary.privilege as p where p.module_id in \n" +
            "(select m.id from bookbarlibrary.module as m where m.name=?2) and p.role_id in \n" +
            "(select uhr.role_id from bookbarlibrary.user_has_role as uhr where uhr.user_id in \n" +
            "(select u.id from bookbarlibrary.user as u where u.username=?1));" , nativeQuery = true)
    String getPrivilegeByUserAndModule(String username, String modulename);

}
