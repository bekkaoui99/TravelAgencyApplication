package com.travelagency.travelagencyapplication.repository;

import com.travelagency.travelagencyapplication.collection.Activity;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;


public interface ActivityRepository extends MongoRepository<Activity, String> {
    Optional<Activity> findByTitle(String title);
}
