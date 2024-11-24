package com.travelagency.travelagencyapplication.repository;

import com.travelagency.travelagencyapplication.collection.Companion;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CompanionRepository extends MongoRepository<Companion, String> {

    Optional<Companion> findByUserName(String userName);
    Optional<Companion> findByCin(String cin);

}
