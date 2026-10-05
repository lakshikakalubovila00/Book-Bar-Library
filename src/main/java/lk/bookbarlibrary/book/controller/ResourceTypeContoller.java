package lk.bookbarlibrary.book.controller;

import lk.bookbarlibrary.book.dao.ResourceTypeDao;
import lk.bookbarlibrary.book.entity.ResourceType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ResourceTypeContoller {
    @Autowired
    private ResourceTypeDao resourceTypeDao;

    @GetMapping(value = "/resourcetype/alldata", produces = "application/json")
    public List<ResourceType> getAllResourceTypes() {
        return resourceTypeDao.findAll();
    }
}
