package lk.bookbarlibrary.shelflocation.dao;

import lk.bookbarlibrary.shelflocation.entity.Building;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BuildingDao extends JpaRepository<Building, Integer> {
}
