package com.travelagency.travelagencyapplication.dto.response;

import com.travelagency.travelagencyapplication.collection.Guide;
import com.travelagency.travelagencyapplication.collection.User;
import com.travelagency.travelagencyapplication.dto.request.ActivityRequest;
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
public class DayTripResponse {

    private String id;
    private String title;
    private String destination;
    // question: I don't know what doest it mean ;
    private String status;
    private Set<String> imagesUrl;
    private LocalDate dayTripDate;
    private Guide guide;
    private String shortDescription;
    private String longDescription;
    private Set<ActivityResponse> activities;
}
