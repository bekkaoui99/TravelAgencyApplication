package com.travelagency.travelagencyapplication.repository;

import com.travelagency.travelagencyapplication.collection.Admin;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;


public interface AdminRepository extends MongoRepository<Admin, String> {
    Optional<Admin> findByEmail(String email);
    Optional<Admin> findByCin(String cin);
    boolean existsByEmail(String email);
    boolean existsByCin(String cin);
}
