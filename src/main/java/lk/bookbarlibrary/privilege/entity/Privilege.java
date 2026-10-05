package lk.bookbarlibrary.privilege.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.bookbarlibrary.user.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity // convert Module class into Entity (persitence entity)
@Table(name="privilege") // Specifies the primary table for the annotated entity

@Data // generate setter function, getter function , toString function
@AllArgsConstructor // all argument constructor
@NoArgsConstructor // Empty constructor

public class Privilege {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private Boolean privi_select ;

    @NotNull
    private Boolean privi_insert ;

    @NotNull
    private Boolean privi_update ;

    @NotNull
    private Boolean privi_delete ;

    private LocalDateTime addeddatetime ;
    private LocalDateTime updateddatetime;

    @ManyToOne
    @JoinColumn(name="role_id", referencedColumnName = "id")
    private Role role_id; 

    @ManyToOne
    @JoinColumn(name="module_id", referencedColumnName = "id")
    private Module module_id;
}
