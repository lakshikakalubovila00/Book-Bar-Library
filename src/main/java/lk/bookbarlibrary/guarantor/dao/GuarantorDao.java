package lk.bookbarlibrary.guarantor.dao;

import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bookbarlibrary.guarantor.entity.Guarantor;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GuarantorDao extends JpaRepository<Guarantor, Integer> {

    @Query(value = "select g from Guarantor g where g.nic=?1")
    Guarantor getByNic(String nic);



//    Find all guarantors whose NIC contains the given NIC text
//    AND whose mobile number contains the given mobile text
//    ignoring uppercase and lowercase

    @Query("SELECT g FROM Guarantor g " +
            "WHERE LOWER(g.nic) = LOWER(:nic) " +
            "OR LOWER(g.mobileno) = LOWER(:mobileno)")
    Guarantor searchByNicORMobileNo(
            @Param("nic") String nic,
            @Param("mobileno") String mobileno
        );

    @Query(value = "select g from Guarantor g where g.nic=?1")
    Guarantor getGuarantorByNic(String nic);

    @Query(value = "select g from Guarantor g where g.email=?1")
    Guarantor getByEmail(String email);

    @Query(value = "select g from Guarantor g where g.mobileno=?1")
    Guarantor getByMobileno(String mobileno);

}
