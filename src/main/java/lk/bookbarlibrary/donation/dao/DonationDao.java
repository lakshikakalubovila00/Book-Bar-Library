package lk.bookbarlibrary.donation.dao;

import lk.bookbarlibrary.donation.entity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DonationDao extends JpaRepository<Donation,Integer> {

    @Query(value = "SELECT coalesce(concat(year(current_date()),lpad(substring(max(d.donationcode),5)+1,6,'0')),concat(year(current_date()),'000001')) FROM Donation d where year(current_date())=year(d.addeddatetime);", nativeQuery = true)
    String getNextCodeNo();
}
