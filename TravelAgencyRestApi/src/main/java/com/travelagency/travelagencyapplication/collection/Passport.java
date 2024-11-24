package com.travelagency.travelagencyapplication.collection;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Passport {
    private String passportNumber;
    private LocalDate issueDate;
    private LocalDate expiryDate;
}
