package lk.bookbarlibrary.membershiptype.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "membershiptypecategory")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MembershipTypeCategory {
    @Id // indicate primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto increment
    private Integer id;

    @NotNull
    private String name;
}
