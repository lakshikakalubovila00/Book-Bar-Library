package lk.bookbarlibrary.donator.dao;

import lk.bookbarlibrary.donator.entity.DonatorStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DonatorStatusDao extends JpaRepository<DonatorStatus, Integer> {
}
