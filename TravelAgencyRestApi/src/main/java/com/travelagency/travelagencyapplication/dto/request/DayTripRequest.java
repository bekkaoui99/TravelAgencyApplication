package com.travelagency.travelagencyapplication.dto.request;

import com.travelagency.travelagencyapplication.collection.Activity;
import com.travelagency.travelagencyapplication.collection.User;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Date;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DayTripRequest{

    private String title;
    private String destination;
    // question: I don't know what doest it mean ;
    private String status;
    private Set<MultipartFile> imagesFile;
    private Set<String> imagesUrl;
    private LocalDate dayTripDate;
    private String activityGuideId;

    private String shortDescription;
    private String longDescription;
    private Set<DayTripActivityRequest> activities;

}
