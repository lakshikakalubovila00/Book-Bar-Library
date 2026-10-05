package lk.bookbarlibrary.user.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.bookbarlibrary.employee.entity.Employee;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // specifies that the class is an entity
@Table(name="user") // Specifies the primary table for the annotated entity

@Data // generate setters, getters, toString
@AllArgsConstructor // all argument constructor
@NoArgsConstructor // default constructor
@JsonInclude(JsonInclude.Include.NON_NULL)

public class User {

@Id //PK
@GeneratedValue(strategy = GenerationType.IDENTITY) //auto increment
private Integer id;

@Column(name="username" , unique = true)
@NotNull
private String username;

@Column(name="password")
@NotNull
private String password;

@NotNull
private String email;

private String note;

@NotNull
private Boolean userstatus;

private LocalDateTime addeddatetime ;
private LocalDateTime updateddatetime;
private LocalDateTime deleteddatetime;

private byte[] userphoto;

@ManyToOne(optional = true)
@JoinColumn(name="employee_id", referencedColumnName = "id")
private Employee employee_id;

@ManyToMany // many to many relationship between user and role
@JoinTable(name="user_has_role",joinColumns = @JoinColumn(name="user_id"),inverseJoinColumns = @JoinColumn(name = "role_id"))
private Set<Role> roles;

public User(Integer id, String username, Employee employee_id,String email, Boolean userstatus) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.employee_id = employee_id;
    this.userstatus = userstatus;
}

}
