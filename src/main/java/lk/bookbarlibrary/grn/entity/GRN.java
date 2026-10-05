package lk.bookbarlibrary.grn.entity;

import jakarta.persistence.*;
import lk.bookbarlibrary.purchase.entity.Purchase;
import lk.bookbarlibrary.purchase.entity.PurchaseHasBook;
import lk.bookbarlibrary.supplier.entity.Supplier;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity // convert grn class into Entity (persitence entity)
@Table(name="grn") //Specifies the primary table for the annotated entity

@Data //generate setter function , getter function , toString function
@AllArgsConstructor//all argument constructor
@NoArgsConstructor // Empty constructor

public class GRN {
    @Id // indicate primary key
    @GeneratedValue(strategy= GenerationType.IDENTITY) // auto increment
    private Integer id ;

    private String grnno ;

    private String supplierbillno ;

    private LocalDate datereceived ;

    private Integer totalbooks ;

    private BigDecimal totalamount ;

    private BigDecimal discount ;

    private BigDecimal taxamount ;

    private BigDecimal netamount ;

    private BigDecimal balance;

    private String note ;

    private LocalDateTime addeddatetime ;

    private LocalDateTime updateddatetime ;

    private LocalDateTime deleteddatetime ;

    private Integer addeduserid ;

    private Integer updateduserid ;

    private Integer deleteduserid ;
    @ManyToOne
    @JoinColumn(name="supplier_id", referencedColumnName = "id")
    private Supplier supplier_id ;

    @ManyToOne
    @JoinColumn(name="purchase_id", referencedColumnName = "id")
    private Purchase purchase_id ;

    @ManyToOne
    @JoinColumn(name="grnstatus_id", referencedColumnName = "id")
    private GRNStatus grnstatus_id ;

    // main side's link in the association used for mappedBy. can identify the relationship by this.
    // orphanRemoval- need to remove books from the list
    // cascade - need to add and access to association
    @OneToMany(mappedBy = "grn_id" , orphanRemoval = true, cascade = CascadeType.ALL)
    private List<GRNHasBook> grnHasBookList;
}
