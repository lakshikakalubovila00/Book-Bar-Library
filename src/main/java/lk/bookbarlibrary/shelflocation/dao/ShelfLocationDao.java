package lk.bookbarlibrary.shelflocation.dao;

import lk.bookbarlibrary.shelflocation.entity.ShelfLocation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShelfLocationDao extends JpaRepository<ShelfLocation,Integer> {
}
