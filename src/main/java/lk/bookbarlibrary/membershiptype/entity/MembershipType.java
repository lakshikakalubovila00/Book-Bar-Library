package lk.bookbarlibrary.membershiptype.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.Year;

@Entity
@Table(name="membershiptype")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class MembershipType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id ;

    @NotNull
    private String name ;

    @NotNull
    private String year;

    @NotNull
    private String membershipduration ;

    @NotNull
    private BigDecimal membershipfee ;

    @NotNull
    private BigDecimal renewalfee ;

    @NotNull
    private Integer borrowduration ;

    @NotNull
    private Integer reservationduration ;

    @NotNull
    private Integer borrowlimit ;

    @NotNull
    private Integer reservationlimit ;

    @NotNull
    private BigDecimal reservationfee ;

    @NotNull
    private BigDecimal fineprice ;

    private String description ;

    @ManyToOne
    @JoinColumn(name="membershiptypecategory_id", referencedColumnName = "id")
    private MembershipTypeCategory membershiptypecategory_id ;


    @ManyToOne
    @JoinColumn(name="membershiptypestatus_id", referencedColumnName = "id")
    private MembershipTypeStatus membershiptypestatus_id ;

    @NotNull
    private LocalDateTime addeddatetime ;

    private LocalDateTime updateddatetime ;

    private LocalDateTime deleteddatetime ;

    @NotNull
    private Integer addeduserid ;

    private Integer updateduserid ;

    private Integer deleteduserid ;
}
