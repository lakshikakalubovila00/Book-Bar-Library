package lk.bookbarlibrary.book.dao;

import lk.bookbarlibrary.book.entity.AcquisitionMethod;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AcquisitionMethodDao extends JpaRepository<AcquisitionMethod,Integer> {

}
