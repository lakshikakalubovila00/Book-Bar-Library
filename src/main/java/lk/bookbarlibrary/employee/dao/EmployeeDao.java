package lk.bookbarlibrary.employee.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import lk.bookbarlibrary.employee.entity.Employee;
import java.util.List;

//  EmployeeDao extended from JpaRepository and inherit all methods by it

public interface EmployeeDao extends JpaRepository<Employee,Integer> {

    // Query

    // native query ---  @Query(value="" , nativeQuery= true)
    // actual database SQL

    // Jpa query --- @Query(value="")
    // Java Persistence Query Language
    // queries entities and their fields, not database tables and columns

    //get employee record by given nic
    @Query(value="select e from Employee e where e.nic=?1")
    Employee getByNic(String nic);

    // get employee record by given email
    @Query(value="select e from Employee e where e.email=?1")
    Employee getByEmail(String email);

    // get employee record by given mobile number
    @Query(value="select e from Employee e where e.mobilenumber=:mobile")
    Employee getByMobileNo(@Param("mobile") String mobilenumber);

    // auto generate employee number
    @Query(value="SELECT coalesce(lpad(max(e.empno)+1,8,'0'),'00000001') FROM bookbarlibrary.employee as e;" , nativeQuery= true)
    String getNextEmpNo();

    // get only required employee columns - enhance performance
    @Query(value = "SELECT new Employee(e.id,e.employeephoto, e.fullname,e.callingname, e.nic, e.email, e.mobilenumber , e.designation_id, e.employeestatus_id ) FROM Employee e" )
    List<Employee> getSelectedColumns();

}
