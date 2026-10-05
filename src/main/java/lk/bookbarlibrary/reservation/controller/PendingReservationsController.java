package lk.bookbarlibrary.reservation.controller;

import lk.bookbarlibrary.AuthController;
import lk.bookbarlibrary.privilege.entity.Privilege;
import lk.bookbarlibrary.reservation.dao.ReservationDao;
import lk.bookbarlibrary.reservation.entity.Reservation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.List;

@RestController
public class PendingReservationsController {
    @Autowired
    private AuthController authController;

    @Autowired
    private ReservationDao reservationDao;

    @RequestMapping(value="/pendingreservations")
    public ModelAndView getPendingReservationsUi() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView pendingReservationView = new ModelAndView();
        pendingReservationView.addObject("loggedusername", authentication.getName());
        pendingReservationView.addObject("title", "Pending Reservations");
        pendingReservationView.setViewName("pendingreservations.html");
        return pendingReservationView;
    }

    @GetMapping(value = "/pendingreservations/alldata", produces = "application/json")
    public List<Reservation> findAllPendingReservations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivi=authController.getPrivilegeByUserAndModule(authentication.getName(),"Pending-Reservations");
        if(userPrivi.getPrivi_select()){
            return reservationDao.getAllPendingReservations();
        }else{
            return new ArrayList<>();
        }
    }
}
