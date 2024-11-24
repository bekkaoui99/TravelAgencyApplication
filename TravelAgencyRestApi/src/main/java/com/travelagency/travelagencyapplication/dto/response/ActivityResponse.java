package com.travelagency.travelagencyapplication.dto.response;

import com.travelagency.travelagencyapplication.collection.Guide;
import com.travelagency.travelagencyapplication.collection.User;
import com.travelagency.travelagencyapplication.enums.ActivityCostType;
import com.travelagency.travelagencyapplication.enums.ActivityType;
import com.travelagency.travelagencyapplication.enums.PaymentType;
import lombok.*;

import java.time.LocalTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityResponse{

    private String id;
    private String title;
    private String destination;
    private Set<String> imagesUrl;
    private String shortDescription;
    private String longDescription;
    private GuideResponse activityGuide;
    private ActivityType activityType;
    private ActivityCostType activityCostType;

    private Double activityAdditionalPrice;
    private LocalTime startAt;
    private LocalTime endAt;

}
