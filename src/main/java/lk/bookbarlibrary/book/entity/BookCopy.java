package lk.bookbarlibrary.book.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;

@Entity
@Table(name = "bookcopy")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookCopy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id ;

    // char 5
    private String copyno ;

    // char 12
    private String accessionno ;


    private LocalDate acquisitiondate ;

    //data type
    //private String price ;

    private Boolean isreserved ;

    @ManyToOne
    @JoinColumn(name = "book_id", referencedColumnName = "id")
    private Book book_id ;

    @ManyToOne
    @JoinColumn(name = "acquisitionmethod_id", referencedColumnName = "id")
    private AcquisitionMethod acquisitionmethod_id ;

    @ManyToOne
    @JoinColumn(name = "bookcopystatus_id", referencedColumnName = "id")
    private BookCopyStatus bookcopystatus_id ;

    @ManyToOne
    @JoinColumn(name = "damagestatus_id", referencedColumnName = "id")
    private DamageStatus damagestatus_id ;

    private LocalDateTime addeddatetime ;
    private LocalDateTime updateddatetime ;
    private LocalDateTime deleteddatetime ;

    private Integer addeduserid ;
    private Integer updateduserid ;
    private Integer deleteduserid ;
}
