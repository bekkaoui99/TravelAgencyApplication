package com.travelagency.travelagencyapplication.repository;

import com.travelagency.travelagencyapplication.collection.DayTrip;
import com.travelagency.travelagencyapplication.collection.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface DayTripRepository extends MongoRepository<DayTrip, String> {

}
