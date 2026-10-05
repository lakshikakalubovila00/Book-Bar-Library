package lk.bookbarlibrary.memberpayment.entity;

import jakarta.persistence.*;
import lk.bookbarlibrary.member.entity.Member;
import lk.bookbarlibrary.membership.entity.Membership;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity // convert Payment class into Entity (persitence entity)
@Table(name="payment") //Specifies the primary table for the annotated entity

@Data //generate setter function , getter function , toString function
@AllArgsConstructor//all argument constructor
@NoArgsConstructor // Empty constructor

public class Payment {

    @Id // indicate primary key
    @GeneratedValue(strategy= GenerationType.IDENTITY) // auto increment
    private Integer id ;

    private BigDecimal amount ;

    private String referenceno ;

    private String note ;

    @ManyToOne
    @JoinColumn(name="paymenttype_id", referencedColumnName = "id")
    private PaymentType paymenttype_id ;

    @ManyToOne
    @JoinColumn(name="member_id", referencedColumnName = "id")
    private Member member_id ;

    @ManyToOne
    @JoinColumn(name="membership_id", referencedColumnName = "id")
    private Membership membership_id ;

    @ManyToOne
    @JoinColumn(name="memberpaymentmethod_id", referencedColumnName = "id")
    private MemberPaymentMethod memberpaymentmethod_id ;


    @OneToMany(mappedBy="payment_id", cascade=CascadeType.ALL)
    // by cascade - operations performed on the parent entity are automatically applied to its child entities
    private List<PaymentHasBorrow> paymentHasBorrowList;


    private LocalDateTime addeddatetime;
    private Integer addeduserid;

    private String paymentno;

}
