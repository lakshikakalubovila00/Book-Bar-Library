package lk.bookbarlibrary.employee.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bookbarlibrary.employee.entity.EmployeeStatus;

public interface EmployeeStatusDao extends JpaRepository<EmployeeStatus,Integer> {

}
