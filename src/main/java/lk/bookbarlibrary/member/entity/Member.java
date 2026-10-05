package lk.bookbarlibrary.member.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import org.hibernate.validator.constraints.Length;

import jakarta.validation.constraints.NotNull;
import lk.bookbarlibrary.guarantor.entity.Guarantor;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Table(name="member")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Member {

    @Id
    @GeneratedValue(strategy =GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private String name;

    @Column(name = "nic", unique = true)
    @Length(min = 10, max = 12, message = "Nic value length must be 10 or 12")
    private String nic;

    @NotNull
    private LocalDate dob;

    @Column(name = "email", unique = true)
    private String email;

    //@NotNull
    @Column(name ="mobileno",unique = true)
    private String mobileno;

    @NotNull
    private String address;

    private byte[] memberphoto;

    private String note;

    @Column(name = "memberno", unique = true)
    @Length( max=12, message = "Member No length must be 12")
    @NotNull
    private String memberno;

    @NotNull
    private String membertype;

    @NotNull
    private String guarantortype;

    private Integer addeduserid ;
    private LocalDateTime addeddatetime;

    private Integer updateduserid; 
    private LocalDateTime updateddatetime;

    private Integer deleteduserid;
    private LocalDateTime deleteddatetime;

    @ManyToOne
    @JoinColumn(name="memberstatus_id", referencedColumnName = "id")
    private MemberStatus memberstatus_id;

    @ManyToOne
    @JoinColumn(name="guarantor_id", referencedColumnName = "id")
    private Guarantor guarantor_id;

    @Column(name="username" , unique = true)
    @NotNull
    private String username;

    @Column(name="password" , unique = true)
    @NotNull
    private String password;

    @NotNull
    private Boolean accountstatus;

}
