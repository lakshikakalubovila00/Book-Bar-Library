package lk.bookbarlibrary.book.dao;

import lk.bookbarlibrary.book.entity.ResourceType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceTypeDao extends JpaRepository<ResourceType, Integer> {

}
