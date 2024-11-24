package com.travelagency.travelagencyapplication.mapper;

import com.travelagency.travelagencyapplication.collection.User;
import com.travelagency.travelagencyapplication.dto.request.RegistrationRequest;
import com.travelagency.travelagencyapplication.dto.request.UserRequest;
import com.travelagency.travelagencyapplication.dto.response.RegistrationResponse;
import com.travelagency.travelagencyapplication.dto.response.UserResponse;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class UserMapper extends DtoMapperImpl<User, UserRequest, UserResponse> {

    public UserMapper(ModelMapper modelMapper) {
        super(modelMapper, User.class, UserResponse.class);
    }

}
