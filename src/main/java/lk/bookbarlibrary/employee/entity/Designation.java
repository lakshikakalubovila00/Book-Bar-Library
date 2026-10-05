package lk.bookbarlibrary.employee.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // convert Employee class into Entity (persitence entity)
@Table(name="designation") // Specifies the primary table for the annotated entity

@Data // generate setter function, getter function , toString function
@AllArgsConstructor // all argument constructor
@NoArgsConstructor // Empty constructor

public class Designation {
    
@Id // indicate primary key
@GeneratedValue(strategy =GenerationType.IDENTITY) // auto increment
private Integer id;
 
@NotNull
private String name;

private Boolean useraccount;

private Integer role_id;
}
