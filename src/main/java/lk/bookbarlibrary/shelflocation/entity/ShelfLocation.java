package lk.bookbarlibrary.shelflocation.entity;

import jakarta.persistence.*;
import lk.bookbarlibrary.book.entity.DisplayCategory;
import lk.bookbarlibrary.book.entity.Language;
import lk.bookbarlibrary.purchase.entity.PurchaseHasBook;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity // convert  class into Entity (persitence entity)
@Table(name = "shelflocation") // Specifies the primary table for the annotated entity

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShelfLocation {
    @Id // indicate primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "displaycategory_id" , referencedColumnName="id")
    private DisplayCategory displaycategory_id;


    private LocalDateTime addeddatetime ;
    private Integer addeduserid ;

    private LocalDateTime updateddatetime ;
    private Integer updateduserid ;

    private LocalDateTime deleteddatetime ;
    private Integer deleteduserid ;

    // main side's link in the association used for mappedBy. can identify the relationship by this.
    // orphanRemovel- need to reomve books from the list
    // cascade - need to add and access to association
    @OneToMany(mappedBy = "shelflocation_id" , orphanRemoval = true, cascade = CascadeType.ALL)
    private List<ShelfLocationItem> shelfLocationList;

}
