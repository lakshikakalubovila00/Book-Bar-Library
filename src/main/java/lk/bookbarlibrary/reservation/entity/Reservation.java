package lk.bookbarlibrary.reservation.entity;

import jakarta.persistence.*;
import lk.bookbarlibrary.book.entity.BookCopy;
import lk.bookbarlibrary.member.entity.Member;
import lk.bookbarlibrary.purchase.entity.PurchaseStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity // convert reservation class into Entity (persitence entity)
@Table(name="reservation") //Specifies the primary table for the annotated entity

@Data //generate setter function , getter function , toString function
@AllArgsConstructor//all argument constructor
@NoArgsConstructor // Empty constructor
public class Reservation {

    @Id // indicate primary key
    @GeneratedValue(strategy= GenerationType.IDENTITY) // auto increment
    private Integer id ;

    private String reservationno;

    private LocalDate reserveddate ;

    private LocalDate borrowdate ;

    private byte[] payslipphoto;

    private String note ;

    @ManyToOne
    @JoinColumn(name = "member_id" , referencedColumnName = "id")
    private Member member_id ;

    @ManyToOne
    @JoinColumn(name = "reservationstatus_id" , referencedColumnName = "id")
    private ReservationStatus reservationstatus_id ;

    @OneToOne
    @JoinColumn(name = "bookcopy_id" , referencedColumnName = "id")
    private BookCopy bookcopy_id ;

    private Integer addeduserid ;
    private LocalDateTime addeddatetime;

    private Integer updateduserid;
    private LocalDateTime updateddatetime;

    private Integer deleteduserid;
    private LocalDateTime deleteddatetime;
}
