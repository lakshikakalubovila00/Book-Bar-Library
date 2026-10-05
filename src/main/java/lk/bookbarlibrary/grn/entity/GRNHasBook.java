package lk.bookbarlibrary.grn.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lk.bookbarlibrary.book.entity.Book;
import lk.bookbarlibrary.supplier.entity.Supplier;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity // convert class into Entity (persitence entity)
@Table(name="grn_has_book") //Specifies the primary table for the annotated entity

@Data //generate setter function , getter function , toString function
@AllArgsConstructor//all argument constructor
@NoArgsConstructor // Empty constructor
public class GRNHasBook {

    @Id // indicate primary key
    @GeneratedValue(strategy= GenerationType.IDENTITY) // auto increment
    private Integer id ;

    private Integer orderedquantity ;

    private Integer receivedquantity ;

    private BigDecimal unitprice ;

    private BigDecimal lineamount ;

    private String remarks ;

    @ManyToOne
    @JoinColumn(name="book_id", referencedColumnName = "id")
    private Book book_id ;

    @ManyToOne
    @JoinColumn(name="grn_id", referencedColumnName = "id")
    @JsonIgnore
    private GRN grn_id ;

    @ManyToOne
    @JoinColumn(name="conditions_id", referencedColumnName = "id")
    private Conditions conditions_id ;
}
