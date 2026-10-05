package lk.bookbarlibrary.reservation.dao;

import lk.bookbarlibrary.reservation.entity.Reservation;
import lk.bookbarlibrary.reservation.entity.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationStatusDao extends JpaRepository<ReservationStatus, Integer> {
}
