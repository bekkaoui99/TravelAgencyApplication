package com.travelagency.travelagencyapplication.mapper;

import com.travelagency.travelagencyapplication.collection.Client;
import com.travelagency.travelagencyapplication.collection.User;
import com.travelagency.travelagencyapplication.dto.request.ClientRequest;
import com.travelagency.travelagencyapplication.dto.request.UserRequest;
import com.travelagency.travelagencyapplication.dto.response.ClientResponse;
import com.travelagency.travelagencyapplication.dto.response.UserResponse;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
    public class ClientMapper extends DtoMapperImpl<Client, ClientRequest, ClientResponse> {

    public ClientMapper(ModelMapper modelMapper) {
        super(modelMapper, Client.class, ClientResponse.class);
    }

}
