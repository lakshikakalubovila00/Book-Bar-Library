package lk.bookbarlibrary.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // specifies that the class is an entity
@Table(name="user_has_role") // Specifies the primary table for the annotated entity

@Data // generate setters, getters, toString
@AllArgsConstructor // all argument constructor
@NoArgsConstructor // default constructor
public class UserHasRole {

    @Id
    @ManyToOne(optional = true)
    @JoinColumn(name="user_id", referencedColumnName = "id")
    private User user_id;

    @Id
    @ManyToOne(optional = true)
    @JoinColumn(name="role_id", referencedColumnName = "id")
    private Role role_id;

}
