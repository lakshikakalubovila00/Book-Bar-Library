package lk.bookbarlibrary.user.dao;

import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;

import lk.bookbarlibrary.user.entity.User;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserDao extends JpaRepository<User,Integer> {

    @Query(value = "select u from User u where u.username=?1")
    User getByUsername(String username);

    @Query(value ="select  u from User u where  u.email=?1" )
    User getByEmail(@NotNull String email);

    @Query(value = "select  u from  User u where u.employee_id.id=?1")
    User getByEmployee_id(Integer id);

    @Query(value = "select new User(u.id, u.username,u.employee_id, u.email, u.userstatus) from User  u where u.username<>'Admin' ")
    List<User> getSelectedColumns();

    @Query("SELECT u FROM User u WHERE u.employee_id.designation_id.name='Librarian'")
    User findByDesignation(String librarian);
}
