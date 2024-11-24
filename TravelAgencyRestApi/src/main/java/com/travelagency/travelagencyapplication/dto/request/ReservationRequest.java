package com.travelagency.travelagencyapplication.dto.request;

import com.travelagency.travelagencyapplication.collection.*;
import com.travelagency.travelagencyapplication.enums.PaymentStatus;
import com.travelagency.travelagencyapplication.enums.PaymentType;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationRequest {

    private boolean updatedMethod;

    private PaymentStatus paymentStatus;

    private PaymentType paymentType;

    private String travelId;

//    private Set<PackRequest> packs;
    private String packName;

    private String hotelId;

    private String hosting;

    private String clientId;

    private Double discount;

    private Set<String> companionsId;

}
