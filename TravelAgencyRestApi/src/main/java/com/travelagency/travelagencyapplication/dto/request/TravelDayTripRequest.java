package com.travelagency.travelagencyapplication.dto.request;

import lombok.*;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TravelDayTripRequest {

    private LocalDate dayTripDate;
    private String dayTripId;

}
