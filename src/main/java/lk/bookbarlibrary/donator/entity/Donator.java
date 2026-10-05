package lk.bookbarlibrary.donator.entity;

import jakarta.persistence.*;
import lk.bookbarlibrary.guarantor.entity.GuarantorStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "donator")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Donator {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id ;

    private String name ;

    private String email ;

    private String contactno ;

    private String address;

    private String note ;

    private String donatortype;

    @ManyToOne
    @JoinColumn(name = "donatorstatus_id", referencedColumnName = "id")
    private DonatorStatus donatorstatus_id ;

    private LocalDateTime addeddatetime ;
    private LocalDateTime updateddatetime ;
    private LocalDateTime deleteddatetime ;

    private Integer addeduserid ;
    private Integer updateduserid ;
    private Integer deleteduserid ;
}
