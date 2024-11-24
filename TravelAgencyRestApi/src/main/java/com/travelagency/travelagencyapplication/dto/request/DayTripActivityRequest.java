package com.travelagency.travelagencyapplication.dto.request;

import lombok.*;

import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DayTripActivityRequest {
    private String activityId;
    private LocalTime startAt;
    private LocalTime endAt;
}
