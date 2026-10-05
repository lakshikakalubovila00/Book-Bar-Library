package lk.bookbarlibrary.notification.dao;

import lk.bookbarlibrary.notification.entity.NotificationUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NotificationUserDao extends JpaRepository<NotificationUser,Integer> {

    @Query(value = "select nu from NotificationUser nu where nu.user_id.id=?1 order by nu.addeddatetime desc ")
    List<NotificationUser> getNotificationByUser(Integer userid);

    @Query(value = "select count(nu) from NotificationUser nu where nu.user_id.id=?1 and nu.isread=false ")
    Integer getUnreadNotificationCount(Integer userid);
}
