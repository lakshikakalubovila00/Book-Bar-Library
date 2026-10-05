package lk.bookbarlibrary.user.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bookbarlibrary.user.entity.Role;

public interface RoleDao extends JpaRepository<Role,Integer>{

     @Query(value = "select r from Role r where r.name<>'Admin'")
    List<Role> listwithoutadmin();

    @Query(value = "select r from Role r where  r.id in (select uhr.role_id.id from UserHasRole uhr where  uhr.user_id.id=?1)")
    List<Role> getRoleByUserId(Integer userid);
}
