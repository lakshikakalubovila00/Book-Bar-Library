package lk.bookbarlibrary.shelflocation.dao;

import lk.bookbarlibrary.shelflocation.entity.Floor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FloorDao extends JpaRepository<Floor, Integer> {

    @Query(value = "select f Floor from Floor f where f.building_id.id=?1 ")
    List<Floor> getFloorByBuildingId(Integer buildingid);
}
