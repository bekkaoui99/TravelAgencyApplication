package com.travelagency.travelagencyapplication.dto.request;


import com.travelagency.travelagencyapplication.enums.HotelRating;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HotelRequest {

    private String name;
    private HotelRating Rate;
    private String city;
    private String country;
}
