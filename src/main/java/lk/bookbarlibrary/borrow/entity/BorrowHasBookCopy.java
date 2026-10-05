package lk.bookbarlibrary.borrow.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lk.bookbarlibrary.book.entity.BookCopy;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity // convert Borrow has bookcopy class into Entity (persitence entity)
@Table(name="borrow_has_bookcopy") //Specifies the primary table for the annotated entity

@Data //generate setter function , getter function , toString function
@AllArgsConstructor//all argument constructor
@NoArgsConstructor // Empty constructor
public class BorrowHasBookCopy {

    @Id // indicate primary key
    @GeneratedValue(strategy= GenerationType.IDENTITY) // auto increment
    private Integer id ;

    @JsonIgnoreProperties("borrowHasBookCopiesList")
    @ManyToOne(fetch = FetchType.EAGER)
    // FetchType.EAGER means the associated Borrow entity is loaded immediately whenever a BorrowHasBookCopy entity is retrieved
    @JoinColumn(name = "borrow_id" , referencedColumnName = "id")
    // which database column is the foreign key
    private Borrow borrow_id ;
    // without json ignore this list will be run recursively.

    @ManyToOne
    @JoinColumn(name = "bookcopy_id" , referencedColumnName = "id")
    private BookCopy bookcopy_id;

    @ManyToOne
    @JoinColumn(name = "borrowhasbookcopystatus_id" , referencedColumnName = "id")
    private BorrowHasBookCopyStatus borrowhasbookcopystatus_id;

    private LocalDate renewdate ;
    private LocalDate renewhandoverduedate ;
    private LocalDate actualhandovereddate ;

    private Integer delaydays ;
    private Integer damagepercentage ;
    private BigDecimal finecost ;

    @ManyToOne
    @JoinColumn(name="damagetype_id")
    private DamageType damagetype_id;

    private BigDecimal additionalcharges ;
}
