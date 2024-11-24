package com.travelagency.travelagencyapplication.service;

import com.travelagency.travelagencyapplication.dto.request.UserRequest;
import com.travelagency.travelagencyapplication.dto.response.ClientResponse;
import com.travelagency.travelagencyapplication.dto.response.GuideResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IGuideService extends CrudService<UserRequest , GuideResponse , String>{

    Page<GuideResponse> filterClients(String firstName,
                                       String lastName,
                                       String country,
                                       String phone,
                                       Pageable pageable);

}
