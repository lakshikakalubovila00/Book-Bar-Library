package lk.bookbarlibrary.supplierpayment.entity;

import jakarta.persistence.*;
import lk.bookbarlibrary.grn.entity.GRN;
import lk.bookbarlibrary.grn.entity.GRNHasBook;
import lk.bookbarlibrary.supplier.entity.Supplier;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity // convert Supplier Payment class into Entity (persitence entity)
@Table(name="supplierpayment") //Specifies the primary table for the annotated entity

@Data //generate setter function , getter function , toString function
@AllArgsConstructor//all argument constructor
@NoArgsConstructor // Empty constructor
public class SupplierPayment {

    @Id // indicate primary key
    @GeneratedValue(strategy= GenerationType.IDENTITY) // auto increment
    private Integer id ;

    private String paymentno;

    private BigDecimal totalamount ;

    private BigDecimal paidamount ;

    private BigDecimal balance ;

    private String note ;

    private LocalDateTime addeddatetime ;

    private Integer addeduserid ;
    @ManyToOne
    @JoinColumn(name="paymentmethod_id", referencedColumnName = "id")
    private  PaymentMethod paymentmethod_id ;

    @ManyToOne
    @JoinColumn(name="supplier_id", referencedColumnName = "id")
    private Supplier supplier_id ;

    private String chequeno ;

    private LocalDate chequedate ;

    private String transferno ;

    private LocalDate transferdate ;

    // main side's link in the association used for mappedBy. can identify the relationship by this.
    // orphanRemovel- need to reomve books from the list
    // cascade - need to add and access to association
    @OneToMany(mappedBy = "supplierpayment_id" , orphanRemoval = true, cascade = CascadeType.ALL)
    private List<SupplierPaymentHasGRN> supplierPaymentHasGRNList;
}
