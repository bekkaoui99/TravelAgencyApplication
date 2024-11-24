package com.travelagency.travelagencyapplication.collection;

import com.travelagency.travelagencyapplication.enums.TransportType;
import com.travelagency.travelagencyapplication.enums.TravelState;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
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
public class Travel {

    @Id
    private String id;
    private String title;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;

    private Set<String> imagesUrl;

    private Guide travelGuide;

    private TransportType transportType;

    private String transportCompany;

    private TravelState travelState;

    private Set<Pack> packs;

    private Set<DayTrip> dayTrips;

    private Integer reservedSeat;

    private Integer maxSeat;

    @DBRef
    private Set<Client> clients;

    @DBRef
    private Set<Companion> companions;

    @DBRef
    private Set<Client> canceledReservations;

    private Double basedPrice;

    private String shortDescription;

    private String longDescription;

}
