package lk.bookbarlibrary.notification.controller;

import lk.bookbarlibrary.notification.dao.NotificationUserDao;
import lk.bookbarlibrary.notification.entity.NotificationUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class NotificationUserController {
    @Autowired
    private NotificationUserDao notificationEmployeeDao;

    @GetMapping(value = "/notification/byuser/{userid}", produces = "application/json")
    public List<NotificationUser> getNotificationByEmployee(@PathVariable Integer userid){
        return notificationEmployeeDao.getNotificationByUser(userid);
    }

    @GetMapping(value = "/notification/unreadcount/{userid}" , produces = "application/json")
    public Integer getUnreadCount(@PathVariable Integer userid){
        return notificationEmployeeDao.getUnreadNotificationCount(userid);
    }

    @PutMapping(value = "/notification/markasread")
    public String updateData(@RequestBody NotificationUser notificationEmployee) {
        // check existence
        if(notificationEmployee.getId()==null){
            return "Notification Update not completed : Notification Not Exist..";
        }
        NotificationUser extNotification= notificationEmployeeDao.getReferenceById(notificationEmployee.getId());
        if(extNotification.getId()==null){
            return "Notification Update not completed : Notification Not Exist..";
        }
        try{
            notificationEmployee.setIsread(true);
            // operation
            notificationEmployeeDao.save(notificationEmployee);

            // check dependencies
            return "OK";
        }catch (Exception e){
            return "Notification update not completed. "+e.getMessage();
        }

    }
}
