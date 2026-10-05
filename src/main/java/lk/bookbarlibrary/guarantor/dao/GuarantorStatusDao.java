package lk.bookbarlibrary.guarantor.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bookbarlibrary.guarantor.entity.GuarantorStatus;

public interface GuarantorStatusDao extends JpaRepository<GuarantorStatus, Integer>{

}