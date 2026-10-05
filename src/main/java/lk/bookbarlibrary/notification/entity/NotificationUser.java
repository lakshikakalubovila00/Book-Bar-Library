package lk.bookbarlibrary.notification.entity;

import jakarta.persistence.*;
import lk.bookbarlibrary.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name="notificationuser")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;

    private String messagetext;

    private Boolean isread;

    private Integer addeduserid ;
    private LocalDate addeddatetime;

    @ManyToOne
    @JoinColumn(name="user_id", referencedColumnName = "id")
    private User user_id;
}
