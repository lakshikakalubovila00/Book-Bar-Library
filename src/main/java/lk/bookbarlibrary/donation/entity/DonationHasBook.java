package lk.bookbarlibrary.donation.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lk.bookbarlibrary.book.entity.Book;
import lk.bookbarlibrary.purchase.entity.Purchase;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity // convert donator has book class into Entity (persitence entity)
@Table(name="donation_has_book") //Specifies the primary table for the annotated entity

@Data //generate setter function , getter function , toString function
@AllArgsConstructor//all argument constructor
@NoArgsConstructor // Empty constructor

public class DonationHasBook {
    @Id // indicate primary key
    @GeneratedValue(strategy= GenerationType.IDENTITY) // auto increment
    private Integer id ;

    @ManyToOne
    @JoinColumn(name = "donation_id" , referencedColumnName = "id")
    @JsonIgnore
    private Donation donation_id ;
    // without json ignore this list will be run recurssively.

    @ManyToOne
    @JoinColumn(name = "book_id" , referencedColumnName = "id")
    private Book book_id;

    private Integer quantity ;
}
