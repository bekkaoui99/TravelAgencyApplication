package com.travelagency.travelagencyapplication.repository;

import com.travelagency.travelagencyapplication.collection.Travel;
import com.travelagency.travelagencyapplication.collection.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface TravelRepository extends MongoRepository<Travel, String> {
    Optional<Travel> findByTitle(String title);
    boolean existsByTitle(String title);
}
