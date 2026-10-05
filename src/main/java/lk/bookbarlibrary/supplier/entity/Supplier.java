package lk.bookbarlibrary.supplier.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lk.bookbarlibrary.book.entity.Book;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDateTime;
import java.util.List;

@Entity // convert Supplier class into Entity (persitence entity)
@Table(name="supplier") //Specifies the primary table for the annotated entity

@Data //generate setter function , getter function , toString function
@AllArgsConstructor//all argument constructor
@NoArgsConstructor // Empty constructor

public class Supplier {

    @Id // indicate primary key
    @GeneratedValue(strategy=GenerationType.IDENTITY) // auto increment
    private Integer id ;

    @NotNull
    private String name ;

    @Column(name = "email" ,unique = true)
    @NotNull
    private String email ;

    @Column(name = "contactno" ,unique = true)
    @Length(min=10, max=10, message = "Contact Number value must be 10")
    @NotNull
    private String contactno ;

    @NotNull
    private String address ;

    @NotNull
    private String businessregistrationno;

    private String contactpersonname ;

    private String contactpersoncontactno ;

    private String website ;

    private String note ;

    private String accountholdername ;

    private String bankname ;

    private String branchname;

    private String accountno;

    @ManyToOne
    @JoinColumn(name = "supplierstatus_id",referencedColumnName = "id")
    private SupplierStatus supplierstatus_id ;

    private LocalDateTime addeddatetime ;
    private LocalDateTime updateddatetime ;
    private LocalDateTime deleteddatetime ;

    private Integer addeduserid ;
    private Integer updateduserid ;
    private Integer deleteduserid ;

    // Book
    @ManyToMany // many to many relationship between supplier and book
    @JoinTable(name="supplier_has_book",joinColumns = @JoinColumn(name="supplier_id"),inverseJoinColumns = @JoinColumn(name = "book_id"))
    private List<Book> books ;
}
