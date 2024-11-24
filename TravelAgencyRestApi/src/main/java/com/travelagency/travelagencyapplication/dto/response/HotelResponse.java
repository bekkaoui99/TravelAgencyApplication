package com.travelagency.travelagencyapplication.dto.response;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HotelResponse {

    private String id;
    private String name;
    private String Rate;
    private String city;
    private String country;
}
