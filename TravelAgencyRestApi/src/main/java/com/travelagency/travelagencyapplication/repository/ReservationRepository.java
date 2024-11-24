package com.travelagency.travelagencyapplication.repository;

import com.travelagency.travelagencyapplication.collection.Client;
import com.travelagency.travelagencyapplication.collection.DayTrip;
import com.travelagency.travelagencyapplication.collection.Reservation;
import com.travelagency.travelagencyapplication.collection.Travel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends MongoRepository<Reservation, String> {

    List<Reservation> findByTravel(Travel travel);
    List<Reservation> findByClient(Client client);

    Optional<Reservation> findByReservationCode(String reservationCode);

}
