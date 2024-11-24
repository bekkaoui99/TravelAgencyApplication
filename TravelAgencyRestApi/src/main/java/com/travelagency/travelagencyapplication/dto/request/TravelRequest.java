package com.travelagency.travelagencyapplication.dto.request;


import com.travelagency.travelagencyapplication.collection.DayTrip;
import com.travelagency.travelagencyapplication.collection.Pack;
import com.travelagency.travelagencyapplication.collection.User;
import com.travelagency.travelagencyapplication.enums.TransportType;
import com.travelagency.travelagencyapplication.enums.TravelState;
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
public class TravelRequest {

    private String title;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private Set<String> imagesUrl;

    private TransportType transportType;
    private String transportCompany;
    private TravelState travelState;

    private String travelGuideId;
    private Set<PackRequest> packs;
    private Set<TravelDayTripRequest> travelDayTripRequests;
    private Integer maxSeat;
    private Double basedPrice;

    private String shortDescription;
    private String longDescription;

}
