package lk.bookbarlibrary.purchase.entity;

import jakarta.persistence.*;
import lk.bookbarlibrary.supplier.entity.Supplier;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity // convert Purchase class into Entity (persitence entity)
@Table(name="purchase") //Specifies the primary table for the annotated entity

@Data //generate setter function , getter function , toString function
@AllArgsConstructor//all argument constructor
@NoArgsConstructor // Empty constructor

public class Purchase {
    @Id // indicate primary key
    @GeneratedValue(strategy= GenerationType.IDENTITY) // auto increment
    private Integer id ;

    private LocalDate requireddate ;

    private String purchaseordercode ;

    private BigDecimal totalamount ;

    private String note ;

    @ManyToOne
    @JoinColumn(name = "purchasestatus_id" , referencedColumnName = "id")
    private PurchaseStatus purchasestatus_id ;

    @ManyToOne
    @JoinColumn(name = "supplier_id" , referencedColumnName = "id")
    private Supplier supplier_id ;

    private LocalDateTime addeddatetime ;
    private LocalDateTime updateddatetime ;
    private LocalDateTime deleteddatetime ;

    private Integer addeduserid ;
    private Integer updateduserid ;
    private Integer deleteduserid ;

    // main side's link in the association used for mappedBy. can identify the relationship by this.
    // orphanRemoval- need to remove books from the list
    // cascade - need to add and access to association
    @OneToMany(mappedBy = "purchase_id" , orphanRemoval = true, cascade = CascadeType.ALL)
    private List<PurchaseHasBook> purchaseHasBookList;
}
