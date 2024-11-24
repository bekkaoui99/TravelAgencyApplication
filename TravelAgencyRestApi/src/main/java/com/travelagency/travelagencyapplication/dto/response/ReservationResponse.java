package com.travelagency.travelagencyapplication.dto.response;

import com.travelagency.travelagencyapplication.collection.*;
import com.travelagency.travelagencyapplication.dto.request.PackRequest;
import com.travelagency.travelagencyapplication.enums.PaymentStatus;
import com.travelagency.travelagencyapplication.enums.PaymentType;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationResponse {

    private String id;

    private PaymentStatus paymentStatus;

    private PaymentType paymentType;

    private TravelResponse travel;

    private PackResponse pack;

    private Double discount;

    private Set<CompanionResponse> companions;

    private HotelResponse hotel;

    private String hosting;

    private ClientResponse client;

    private Double travelPrice;
}
