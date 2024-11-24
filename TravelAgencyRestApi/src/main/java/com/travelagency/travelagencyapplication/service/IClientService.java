package com.travelagency.travelagencyapplication.service;

import com.travelagency.travelagencyapplication.collection.Client;
import com.travelagency.travelagencyapplication.dto.request.ClientRequest;
import com.travelagency.travelagencyapplication.dto.request.UserRequest;
import com.travelagency.travelagencyapplication.dto.response.ClientResponse;
import com.travelagency.travelagencyapplication.dto.response.RegistrationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IClientService extends CrudService<ClientRequest, ClientResponse , String> {
    Client findClientById(String clientId);
    Page<ClientResponse> filterClients(String firstName,
                                             String lastName,
                                             String country,
                                             String phone,
                                             Pageable pageable);
}
