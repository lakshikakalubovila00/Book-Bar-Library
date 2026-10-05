package lk.bookbarlibrary.privilege.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bookbarlibrary.privilege.entity.Module;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ModuleDao extends JpaRepository<Module,Integer>{

    @Query(value = "SELECT * FROM bookbarlibrary.module as m where m.id not in " +
            "(select p.module_id from bookbarlibrary.privilege as p where p.privi_select=1 and p.role_id in\n" +
            "(select uhr.role_id from bookbarlibrary.user_has_role as uhr where uhr.user_id=?1));", nativeQuery = true)
    List<Module> getModuleBYLoggedUser(Integer id);
}
