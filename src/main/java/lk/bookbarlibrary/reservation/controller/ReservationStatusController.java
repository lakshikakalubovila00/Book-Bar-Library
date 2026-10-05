package lk.bookbarlibrary.reservation.controller;

import lk.bookbarlibrary.reservation.dao.ReservationStatusDao;
import lk.bookbarlibrary.reservation.entity.ReservationStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
public class ReservationStatusController {
    @Autowired
    private ReservationStatusDao reservationStatusDao;

    @GetMapping(value = "/reservationstatus/alldata", produces = "application/json")
    public List<ReservationStatus> getAllReservationStatus() {
        return reservationStatusDao.findAll();
    }
}
