package lk.bookbarlibrary.donator.controller;


import lk.bookbarlibrary.donator.dao.DonatorStatusDao;
import lk.bookbarlibrary.donator.entity.DonatorStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class DonatorStatusController {
@Autowired
   private DonatorStatusDao donatorStatusDao;

@GetMapping(value = "/donatorstatus/alldata", produces = "application/json")
    public List<DonatorStatus> getAllDonatorStatus() {
    return donatorStatusDao.findAll();
}
}
