package lk.bookbarlibrary.notification.dao;

import lk.bookbarlibrary.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationDao extends JpaRepository<Notification,Integer> {
}
