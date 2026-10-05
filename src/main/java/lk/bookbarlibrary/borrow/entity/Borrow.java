package lk.bookbarlibrary.borrow.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lk.bookbarlibrary.member.entity.Member;
import lk.bookbarlibrary.purchase.entity.PurchaseHasBook;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity // convert  class into Entity (persitence entity)
@Table(name="borrow") //Specifies the primary table for the annotated entity

@Data //generate setter function , getter function , toString function
@AllArgsConstructor//all argument constructor
@NoArgsConstructor // Empty constructor
public class Borrow {

    @Id // indicate primary key
    @GeneratedValue(strategy= GenerationType.IDENTITY) // auto increment
    private Integer id ;

    private LocalDate borrowdate ;

    private LocalDate handoverduedate ;

    private String borrowcode ;

    private String note ;

    @ManyToOne
    @JoinColumn(name="borrowstatus_id", referencedColumnName = "id")
    private BorrowStatus borrowstatus_id ;

    @ManyToOne
    @JoinColumn(name="member_id", referencedColumnName = "id")
    private Member member_id ;

    private BigDecimal fullfineamount ;

    //one Borrow record can have many BorrowHasBookCopy records

    // main side's link in the association used for mappedBy. can identify the relationship by this.
    // mapped by
    // preventing Hibernate from creating an extra join table

    // orphanRemoval
    //  need to remove book copies from the list.
    // automatically deletes child records when they are removed from the parent's collection
    
    // cascade
    // need to add and access to association

    @OneToMany(mappedBy = "borrow_id" , orphanRemoval = true, cascade = CascadeType.ALL)
    // Lombok generates a toString() method automatically.Without this annotation, This creates an infinite loop.
    @ToString.Exclude
    //Lombok also generates equals() hashCode()
    // prevent infinite recursive calls when Lombok generates the toString(), equals(), and hashCode() methods.
    @EqualsAndHashCode.Exclude
    private List<BorrowHasBookCopy> borrowHasBookCopiesList;

    private LocalDateTime addeddatetime ;
    private LocalDateTime updateddatetime ;
    private LocalDateTime deleteddatetime ;

    private Integer addeduserid ;
    private Integer updateduserid ;
    private Integer deleteduserid ;

    @Transient
    private BigDecimal remainingfine;

}
