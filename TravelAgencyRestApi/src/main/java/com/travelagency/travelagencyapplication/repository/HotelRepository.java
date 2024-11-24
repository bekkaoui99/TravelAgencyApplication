package com.travelagency.travelagencyapplication.repository;

import com.travelagency.travelagencyapplication.collection.DayTrip;
import com.travelagency.travelagencyapplication.collection.Hotel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface HotelRepository extends MongoRepository<Hotel, String> {
    List<Hotel> findByNameContains(String hotelName);
    Optional<Hotel> findByName(String hotelName);

}
