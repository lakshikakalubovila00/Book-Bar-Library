package lk.bookbarlibrary.borrow.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // convert this class into Entity (persitence entity)
@Table(name="damagetype") // Specifies the primary table for the annotated entity

@Data // generate setter function, getter function , toString function
@AllArgsConstructor // all argument constructor
@NoArgsConstructor // Empty constructor
public class DamageType {

    @Id // indicate primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto increment
    private Integer id;

    @NotNull
    private String name;

    private String reason;
}
