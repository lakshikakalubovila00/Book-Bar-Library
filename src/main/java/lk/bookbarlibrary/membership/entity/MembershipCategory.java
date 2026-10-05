package lk.bookbarlibrary.membership.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "membershipcategory")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MembershipCategory {
    @Id // indicate primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto increment
    private Integer id;

    @NotNull
    private String name;
}
