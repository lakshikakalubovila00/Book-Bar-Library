package lk.bookbarlibrary.book.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.Date;

@Entity
@Table(name = "book")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Book {

    // Primary key - auto increment
    @Id
    @Column(name = "id", unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id ;

    @Column(name = "bookno", unique = true)
    @Length( max=8, message = "Book No length must be 8")
    @NotNull
    private String bookno;

    @Column(name = "title")
    @NotNull
    private String title ;

    @Column(name = "author")
    private String author ;

    @Column(name = "edition")
    private String edition ;

    @Column(name = "editionyear")
    private Year editionyear ;

    @Column(name = "publisher")
    @NotNull
    private String publisher ;

    @Column(name = "isbn" , length = 13)
    private String isbn ;

    @Column(name = "issn", length = 8)
    private String issn ;

    @Column(name = "seriestitle")
    private String seriestitle ;

    @Column(name = "seriesno")
    private String seriesno ;

    @Column(name = "ddcno")
    private String ddcno ;

    @Column(name = "callno")
    private String callno ;

    @Column(name = "pages")
    @NotNull
    private String pages ;

    @Column(name = "description")
    private String description ;

    @Column(name = "coverimage")
    private byte[] coverimage ;

    @Column(name = "note")
    private String note ;

    @Column(name = "startedyear")
    private Year startedyear ;

    @Column(name = "volume")
    private String volume;

    @Column(name = "issueno")
    private String issueno;

    @Column(name = "publicationdate")
    private LocalDate publicationdate;

    @Column(name = "initialprice")
    @NotNull
    private BigDecimal initialprice ;

    @Column(name = "updatedprice")
    @NotNull
    private BigDecimal updatedprice ;

    @ManyToOne
    @JoinColumn(name = "resourcetype_id", referencedColumnName="id")
    private ResourceType resourcetype_id ;

    @ManyToOne
    @JoinColumn(name = "magazinefrequency_id", referencedColumnName="id")
    private MagazineFrequency magazinefrequency_id;

    @ManyToOne
    @JoinColumn(name = "newspaperedition_id", referencedColumnName="id")
    private NewsPaperEdition newspaperedition_id;

    @ManyToOne
    @JoinColumn(name = "newspaperfrequency_id", referencedColumnName="id")
    private NewsPaperFrequency newspaperfrequency_id;

    @ManyToOne
    @JoinColumn(name = "journalfrequency_id", referencedColumnName="id")
    private JournalFrequency journalfrequency_id;

    @ManyToOne
    @JoinColumn(name = "language_id", referencedColumnName="id")
    private Language language_id ;

    @ManyToOne
    @JoinColumn(name = "displaycategory_id", referencedColumnName="id")
    private DisplayCategory displaycategory_id ;

    @ManyToOne
    @JoinColumn(name = "bookstatus_id", referencedColumnName="id")
    private BookStatus bookstatus_id ;

    @Column(name = "addeddatetime")
    private LocalDateTime addeddatetime ;

    @Column(name = "updateddatetime")
    private LocalDateTime updateddatetime ;

    @Column(name = "deleteddatetime")
    private LocalDateTime deleteddatetime ;

    @Column(name = "addeduserid")
    private Integer addeduserid ;

    @Column(name = "updateduserid")
    private Integer updateduserid ;

    @Column(name = "deleteduserid")
    private Integer deleteduserid ;

    //parameterized constructor
    // retrieve only selected fields
    // instead of loading the complete entity - improves performance
    public Book(Integer id ,String bookno , String title, BigDecimal updatedprice) {
        this.id = id;
        this.bookno = bookno;
        this.title = title;
        this.updatedprice = updatedprice;
    }
}
