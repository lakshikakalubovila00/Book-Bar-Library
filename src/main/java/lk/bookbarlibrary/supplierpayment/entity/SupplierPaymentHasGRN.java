package lk.bookbarlibrary.supplierpayment.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lk.bookbarlibrary.grn.entity.GRN;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity // convert class into Entity (persitence entity)
@Table(name="supplierpayment_has_grn") //Specifies the primary table for the annotated entity

@Data //generate setter function , getter function , toString function
@AllArgsConstructor//all argument constructor
@NoArgsConstructor // Empty constructor
public class SupplierPaymentHasGRN {

    @Id // indicate primary key
    @GeneratedValue(strategy= GenerationType.IDENTITY) // auto increment
    private Integer id ;

    private BigDecimal grnamount ;

    private BigDecimal afterbalance ;

    private BigDecimal payamount ;

    private BigDecimal newbalance ;

    @ManyToOne
    @JoinColumn(name = "grn_id", referencedColumnName = "id")
    private GRN grn_id;

    @ManyToOne
    @JoinColumn(name = "supplierpayment_id", referencedColumnName = "id")
    @JsonIgnore
    private SupplierPayment supplierpayment_id;



}
