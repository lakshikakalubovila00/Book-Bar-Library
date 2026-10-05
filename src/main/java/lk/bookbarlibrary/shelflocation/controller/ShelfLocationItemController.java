package lk.bookbarlibrary.shelflocation.controller;

import lk.bookbarlibrary.AuthController;
import lk.bookbarlibrary.privilege.entity.Privilege;
import lk.bookbarlibrary.shelflocation.dao.ShelfLocationItemDao;
import lk.bookbarlibrary.shelflocation.entity.ShelfLocation;
import lk.bookbarlibrary.shelflocation.entity.ShelfLocationItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class ShelfLocationItemController {

    @Autowired
    private ShelfLocationItemDao shelfLocationItemDao;

    @GetMapping(value = "/shelflocations/bydisplaycategoryid/{displaycategoryid}", produces = "application/json")
    public List<ShelfLocationItem> getShelfLocationItemsByDisplayCategory(@PathVariable Integer displaycategoryid) {
        return shelfLocationItemDao.getShelfLocationItemsByDisplayCategory(displaycategoryid);
    }
    @GetMapping(value = "/shelflocationitem/alldata")
    public List<ShelfLocationItem> findAllData() {
            return shelfLocationItemDao.findAll();
    }

}
