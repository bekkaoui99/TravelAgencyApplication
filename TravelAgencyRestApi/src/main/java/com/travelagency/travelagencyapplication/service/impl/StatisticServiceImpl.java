package com.travelagency.travelagencyapplication.service.impl;

import com.travelagency.travelagencyapplication.collection.Reservation;
import com.travelagency.travelagencyapplication.collection.Travel;
import com.travelagency.travelagencyapplication.dto.response.DayTripResponse;
import com.travelagency.travelagencyapplication.dto.response.ReservationResponse;
import com.travelagency.travelagencyapplication.dto.response.StatisticsResponse;
import com.travelagency.travelagencyapplication.repository.*;
import com.travelagency.travelagencyapplication.service.StatisticService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StatisticServiceImpl implements StatisticService {

    private final ActivityRepository activityRepository;
    private final DayTripRepository dayTripRepository;
    private final TravelRepository travelRepository;
    private final ClientRepository clientRepository;
    private final GuideRepository guideRepository;
    private final HotelRepository hotelRepository;
    private final ReservationRepository reservationRepository;
    private final CompanionRepository companionRepository;


    @Override
    public StatisticsResponse getAllStatistics() {
        long activityNumber = this.activityRepository.count();
        long dayTripNumber = this.dayTripRepository.count();
        long travelNumber = this.travelRepository.count();
        long clientNumber = this.clientRepository.count();
        long guideNumber = this.guideRepository.count();
        long hotelNumber = this.hotelRepository.count();
        long reservationNumber = this.reservationRepository.count();
        long companion = this.companionRepository.count();

//        long money = 0;
//        List<Reservation> allReservation = this.reservationRepository.findAll();
//        for (Reservation reservationResponse : allReservation){
//            money += reservationResponse.getTravelPrice();
//        }

        double money = this.reservationRepository.findAll().stream()
                .mapToDouble(Reservation::getTravelPrice)
                .sum();

        long canceledReservations = this.travelRepository.findAll()
                .stream()
                .filter(travel -> travel.getCanceledReservations() != null)
                .mapToLong(travel -> travel.getCanceledReservations().size()) // Flatten all the canceledReservations streams into one
                .sum();

        return StatisticsResponse.builder()
                .activityNumber(activityNumber)
                .dayTripNumber(dayTripNumber)
                .travelNumber(travelNumber)
                .clientNumber(clientNumber)
                .guideNumber(guideNumber)
                .hotelNumber(hotelNumber)
                .reservationNumber(reservationNumber)
                .canceledReservations(canceledReservations)
                .money(money)
                .companion(companion)
                .build();
    }
}
