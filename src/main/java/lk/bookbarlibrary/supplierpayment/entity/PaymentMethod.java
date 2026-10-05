package lk.bookbarlibrary.supplierpayment.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "paymentmethod")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentMethod {
    @Id // indicate primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto increment
    private Integer id;

    @NotNull
    private String name;
}
