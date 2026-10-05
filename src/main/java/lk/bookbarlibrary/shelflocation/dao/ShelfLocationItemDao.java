package lk.bookbarlibrary.shelflocation.dao;

import lk.bookbarlibrary.shelflocation.entity.ShelfLocationItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ShelfLocationItemDao extends JpaRepository<ShelfLocationItem, Integer> {

    @Query(value = "select sli from ShelfLocationItem sli where sli.shelflocation_id.displaycategory_id.id=?1")
    List<ShelfLocationItem> getShelfLocationItemsByDisplayCategory(Integer displaycategoryid);
}
