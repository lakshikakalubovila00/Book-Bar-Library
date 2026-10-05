package lk.bookbarlibrary.donation.controller;

import lk.bookbarlibrary.donation.dao.DonationStatusDao;
import lk.bookbarlibrary.donation.entity.DonationStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class DonationStatusController {
    @Autowired
    private DonationStatusDao donationStatusDao;

    @GetMapping(value = "/donationstatus/alldata", produces = "application/json")
    public List<DonationStatus> findAllData(){
        return donationStatusDao.findAll();
    }
}
