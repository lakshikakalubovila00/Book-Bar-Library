package lk.bookbarlibrary.shelflocation.dao;

import lk.bookbarlibrary.shelflocation.entity.Rack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RackDao extends JpaRepository<Rack, Integer> {
    @Query(value = "select r Rack from Rack r where r.floor_id.id=?1 ")
    List<Rack> getRackByFloorId(Integer floorid);
}
