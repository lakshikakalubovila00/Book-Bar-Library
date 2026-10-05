package lk.bookbarlibrary.shelflocation.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // convert  class into Entity (persitence entity)
@Table(name = "shelflocationitem") // Specifies the primary table for the annotated entity

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShelfLocationItem {
    @Id // indicate primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "shelflocation_id", referencedColumnName="id")
    @JsonIgnore
    private ShelfLocation shelflocation_id;

    private String locationcode ;

    @ManyToOne
    @JoinColumn(name = "rackrow_id" , referencedColumnName="id")
    private Row rackrow_id;
}
