package lk.bookbarlibrary.shelflocation.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // convert  class into Entity (persitence entity)
@Table(name = "building") // Specifies the primary table for the annotated entity

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Building {
    @Id // indicate primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto increment
    private Integer id;

    @NotNull
    private String name;
}
