package com.travelagency.travelagencyapplication.dto.response;

import com.travelagency.travelagencyapplication.collection.Client;
import com.travelagency.travelagencyapplication.collection.Companion;
import com.travelagency.travelagencyapplication.collection.User;
import com.travelagency.travelagencyapplication.dto.request.DayTripRequest;
import com.travelagency.travelagencyapplication.dto.request.PackRequest;
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
public class TravelResponse {

    private String id;
    private String title;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private Set<String> imagesUrl;

    private TransportType transportType;
    private String transportCompany;
    private TravelState travelState;

    private GuideResponse travelGuide;
    private Set<PackResponse> packs;
    private Set<DayTripResponse> dayTrips;

    private Set<ClientResponse> clients;

    private Set<CompanionResponse> companions;

    private Set<ClientResponse> canceledReservations;

    private Integer reservedSeat;
    private Integer maxSeat;
    private Double basedPrice;

    private String shortDescription;
    private String longDescription;
}
