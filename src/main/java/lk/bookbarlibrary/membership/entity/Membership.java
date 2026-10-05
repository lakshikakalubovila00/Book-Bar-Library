package lk.bookbarlibrary.membership.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lk.bookbarlibrary.member.entity.Member;
import lk.bookbarlibrary.membershiptype.entity.MembershipType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name="membership")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Membership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id ;

    @NotNull
    private String membershipno ;

    private BigDecimal fee ;

    private LocalDate startdate ;

    private LocalDate enddate ;

    @ManyToOne
    @JoinColumn(name="member_id", referencedColumnName = "id")
    private Member member_id ;

    @ManyToOne
    @JoinColumn(name="membershiptype_id", referencedColumnName = "id")
    private MembershipType membershiptype_id ;

    @ManyToOne
    @JoinColumn(name="membershipstatus_id", referencedColumnName = "id")
    private MembershipStatus membershipstatus_id ;

    @ManyToOne
    @JoinColumn(name="membershipcategory_id", referencedColumnName = "id")
    private MembershipCategory membershipcategory_id ;

    private LocalDateTime addeddatetime ;
    private LocalDateTime updateddatetime ;
    private LocalDateTime deleteddatetime ;

    private Integer addeduserid ;
    private Integer updateduserid ;
    private Integer deleteduserid ;

    private String note;
}
