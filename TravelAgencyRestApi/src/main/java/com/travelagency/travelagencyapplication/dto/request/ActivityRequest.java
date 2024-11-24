package com.travelagency.travelagencyapplication.dto.request;

import com.travelagency.travelagencyapplication.collection.User;
import com.travelagency.travelagencyapplication.enums.ActivityCostType;
import com.travelagency.travelagencyapplication.enums.ActivityType;
import com.travelagency.travelagencyapplication.enums.PaymentType;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityRequest{

    private String id;
    private String title;
    private String destination;
    private Set<MultipartFile> imagesFile;
    private Set<String> imagesUrl;
    private String shortDescription;
    private String longDescription;

    private String activityGuideId;
    private ActivityType activityType;
    private ActivityCostType activityCostType;

    private Double activityAdditionalPrice;

}
