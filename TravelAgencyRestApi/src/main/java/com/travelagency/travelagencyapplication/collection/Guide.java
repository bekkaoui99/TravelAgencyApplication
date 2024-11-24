package com.travelagency.travelagencyapplication.collection;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document
public class Guide extends User{
    private List<Travel> guideTravels;

}
