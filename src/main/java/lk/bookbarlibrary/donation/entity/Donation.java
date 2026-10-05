package lk.bookbarlibrary.donation.entity;

import jakarta.persistence.*;
import lk.bookbarlibrary.donator.entity.Donator;
import lk.bookbarlibrary.purchase.entity.PurchaseHasBook;
import lk.bookbarlibrary.purchase.entity.PurchaseStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity // convert donation class into Entity (persitence entity)
@Table(name="donation") //Specifies the primary table for the annotated entity

@Data //generate setter function , getter function , toString function
@AllArgsConstructor//all argument constructor
@NoArgsConstructor // Empty constructor

public class Donation {

    @Id // indicate primary key
    @GeneratedValue(strategy= GenerationType.IDENTITY) // auto increment
    private Integer id ;

    private String donationcode ;

    private String purpose ;

    private String note ;

    @ManyToOne
    @JoinColumn(name = "donator_id" , referencedColumnName = "id")
    private Donator donator_id;

    @ManyToOne
    @JoinColumn(name = "donationstatus_id" , referencedColumnName = "id")
    private DonationStatus donationstatus_id ;

    private LocalDateTime addeddatetime ;
    private LocalDateTime updateddatetime ;
    private LocalDateTime deleteddatetime ;

    private Integer addeduserid ;
    private Integer updateduserid ;
    private Integer deleteduserid ;

    // main side's link in the association used for mappedBy. can identify the relationship by this.
    // orphanRemoval- need to remove books from the list
    // cascade - need to add and access to association
    @OneToMany(mappedBy = "donation_id" , orphanRemoval = true, cascade = CascadeType.ALL)
    private List<DonationHasBook> donationHasBookList;
}
