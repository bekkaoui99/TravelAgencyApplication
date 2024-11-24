package com.travelagency.travelagencyapplication.collection;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.Date;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document()
public class DayTrip {

    @Id
    private String id;
    private String title;
    private String destination;
    // question: I don't know what doest it mean ;
    private String status;
    private Set<String> imagesUrl;
    private LocalDate dayTripDate;
    private Guide dayTripGuide;
    private String shortDescription;
    private String longDescription;

    private Set<Activity> activities;
}
