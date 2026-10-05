package lk.bookbarlibrary.shelflocation.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // convert  class into Entity (persitence entity)
@Table(name = "floor") // Specifies the primary table for the annotated entity

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Floor {
    @Id // indicate primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto increment
    private Integer id;

    @NotNull
    private String name;

    @ManyToOne
    @JoinColumn(name = "building_id" , referencedColumnName="id")
    private Building building_id;
}
