package com.travelagency.travelagencyapplication.repository;

import com.travelagency.travelagencyapplication.collection.Guide;
import com.travelagency.travelagencyapplication.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface GuideRepository extends MongoRepository<Guide , String> {
    Optional<Guide> findByUserName(String userName);
    Optional<Guide> findByEmail(String email);
    Optional<Guide> findByCin(String cin);
//    List<Guide> findAllByRole(Role role);
//    Page<Guide> findAllByRole(Pageable pageable , Role role);
    boolean existsByEmail(String email);
    boolean existsByCin(String cin);
}
