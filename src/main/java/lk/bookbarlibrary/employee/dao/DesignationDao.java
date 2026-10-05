package lk.bookbarlibrary.employee.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bookbarlibrary.employee.entity.Designation;

public interface DesignationDao extends JpaRepository<Designation,Integer> {

}
