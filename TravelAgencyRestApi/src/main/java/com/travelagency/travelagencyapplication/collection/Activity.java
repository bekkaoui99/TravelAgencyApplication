package com.travelagency.travelagencyapplication.collection;

import com.travelagency.travelagencyapplication.enums.ActivityCostType;
import com.travelagency.travelagencyapplication.enums.ActivityType;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Document()
public class Activity {

    @Id
    private String id;
    private String title;
    private String destination;
    private Set<String> imagesUrl;
    private String shortDescription;
    private String longDescription;
    private Guide activityGuide;
    private ActivityType activityType;
    private ActivityCostType activityCostType;

    private Double activityAdditionalPrice;

    // these will be defined for each dayTrip
    private LocalTime startAt;
    private LocalTime endAt;
}
