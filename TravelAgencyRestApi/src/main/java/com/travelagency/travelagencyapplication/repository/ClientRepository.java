package com.travelagency.travelagencyapplication.repository;

import com.travelagency.travelagencyapplication.collection.Admin;
import com.travelagency.travelagencyapplication.collection.Client;
import com.travelagency.travelagencyapplication.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;


public interface ClientRepository extends MongoRepository<Client , String> {
    Optional<Client> findByEmail(String email);
    Optional<Client> findByCin(String cin);
    boolean existsByEmail(String email);
    boolean existsByCin(String cin);
//    List<Client> findAllByRole(Role role);
//    Page<Client> findAllByRole(Pageable pageable ,Role role);
}
