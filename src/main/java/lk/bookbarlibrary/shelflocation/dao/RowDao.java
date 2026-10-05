package lk.bookbarlibrary.shelflocation.dao;

import lk.bookbarlibrary.shelflocation.entity.Row;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RowDao extends JpaRepository<Row,Integer> {
    @Query(value = "select r Row from Row r where r.rack_id.id=?1 ")
    List<Row> getRowByRackId(Integer rackid);
}
