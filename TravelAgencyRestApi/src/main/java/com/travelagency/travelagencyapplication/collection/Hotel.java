package com.travelagency.travelagencyapplication.collection;

import com.fasterxml.jackson.databind.annotation.EnumNaming;
import com.travelagency.travelagencyapplication.enums.HotelRating;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document()
public class Hotel {

    @Id
    private String id;
    private String name;
    private HotelRating Rate;
    private String city;
    private String country;

}
