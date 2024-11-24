package com.travelagency.travelagencyapplication.dto.response;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatisticsResponse {
    Long activityNumber;
    Long dayTripNumber;
    Long travelNumber;
    Long clientNumber;
    Long guideNumber;
    Long hotelNumber;
    Long reservationNumber;
    Long canceledReservations;
    Double money;
    Long companion;
}
