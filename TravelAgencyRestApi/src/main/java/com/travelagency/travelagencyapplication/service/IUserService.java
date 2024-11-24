package com.travelagency.travelagencyapplication.service;

import com.travelagency.travelagencyapplication.dto.request.RegistrationRequest;
import com.travelagency.travelagencyapplication.dto.response.RegistrationResponse;
import com.travelagency.travelagencyapplication.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IUserService{


    RegistrationResponse update(RegistrationRequest registrationRequest , String id , Role role);
    RegistrationResponse delete(String id , Role role);
    RegistrationResponse findOne(String id , Role role);
    List<RegistrationResponse> findAll(Role role);
    Page<RegistrationResponse> findAll(int pageNumber, int pageSize , Role role);
    Page<RegistrationResponse> filterUsers(String firstName,
                                             String lastName,
                                             String country,
                                             String phone,
                                             Role role,
                                             Pageable pageable);

}
