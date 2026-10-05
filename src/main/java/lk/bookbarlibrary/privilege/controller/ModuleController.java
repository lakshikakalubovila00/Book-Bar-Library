package lk.bookbarlibrary.privilege.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.bookbarlibrary.privilege.dao.ModuleDao;

@RestController
public class ModuleController {
@Autowired
    private ModuleDao moduleDao;

    //create get mapping for get module all data [URL="module/alldata"]
    @GetMapping(value="/module/alldata" , produces = "application/json")
    public List<lk.bookbarlibrary.privilege.entity.Module> getModuleAllData() {
        return moduleDao.findAll();
    }


}
