package lk.bookbarlibrary.notification.entity;

import jakarta.persistence.*;
import lk.bookbarlibrary.member.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name="notificationmember")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;

    private String messagetext;

    private Boolean isread;

    private Integer addeduserid ;
    private LocalDate addeddatetime;

    @ManyToOne
    @JoinColumn(name="member_id", referencedColumnName = "id")
    private Member member_id;
}
