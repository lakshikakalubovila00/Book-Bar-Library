package lk.bookbarlibrary.donation.dao;

import lk.bookbarlibrary.donation.entity.DonationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DonationStatusDao extends JpaRepository<DonationStatus,Integer> {
}
