package com.travelagency.travelagencyapplication.collection;

import com.travelagency.travelagencyapplication.enums.PaymentStatus;
import com.travelagency.travelagencyapplication.enums.PaymentType;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document()
public class Reservation {

    @Id
    private String id;

    private String reservationCode;

    private PaymentStatus paymentStatus;

    private PaymentType paymentType;

    private Travel travel;

//    private Set<Pack> packs;
    private Pack pack;

    private Double discount;

    @DBRef
    private Set<Companion> companions;

    private Hotel hotel;

    private String hosting;

    @DBRef
    private Client client;


    private Double travelPrice;


}
