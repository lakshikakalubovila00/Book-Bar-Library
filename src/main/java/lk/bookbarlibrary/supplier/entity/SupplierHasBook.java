package lk.bookbarlibrary.supplier.entity;

import jakarta.persistence.*;
import lk.bookbarlibrary.book.entity.Book;
import lk.bookbarlibrary.user.entity.Role;
import lk.bookbarlibrary.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // specifies that the class is an entity
@Table(name="supplier_has_book") // Specifies the primary table for the annotated entity

@Data // generate setters, getters, toString
@AllArgsConstructor // all argument constructor
@NoArgsConstructor // default constructor

public class SupplierHasBook {
    @Id
    @ManyToOne(optional = true)
    @JoinColumn(name="supplier_id", referencedColumnName = "id")
    private Supplier supplier_id;

    @Id
    @ManyToOne(optional = true)
    @JoinColumn(name="book_id", referencedColumnName = "id")
    private Book book_id;
}
