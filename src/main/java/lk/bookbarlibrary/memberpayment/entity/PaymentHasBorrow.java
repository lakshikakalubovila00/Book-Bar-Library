package lk.bookbarlibrary.memberpayment.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lk.bookbarlibrary.borrow.entity.Borrow;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity // specifies that the class is an entity
@Table(name="payment_has_borrow") // Specifies the primary table for the annotated entity

@Data // generate setters, getters, toString
@AllArgsConstructor // all argument constructor
@NoArgsConstructor // default constructor
public class PaymentHasBorrow {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name="payment_id", referencedColumnName = "id")
    @JsonIgnore
    private Payment payment_id ;

    @ManyToOne
    @JoinColumn(name="borrow_id", referencedColumnName = "id")
    private Borrow borrow_id ;

    private BigDecimal paidamount;
}
