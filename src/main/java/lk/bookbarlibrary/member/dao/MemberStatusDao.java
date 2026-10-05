package lk.bookbarlibrary.member.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bookbarlibrary.member.entity.MemberStatus;

public interface MemberStatusDao extends JpaRepository<MemberStatus, Integer> {

}
