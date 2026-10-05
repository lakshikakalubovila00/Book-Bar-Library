package lk.bookbarlibrary.donator.dao;

import lk.bookbarlibrary.donator.entity.Donator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface DonatorDao extends JpaRepository<Donator,Integer> {

    @Query(value = "select d from Donator d where d.email=?1")
    Donator getByEmail(String email);

    @Query(value = "select d from Donator d where d.contactno=?1")
    Donator getByContactno(String contactno);
}
