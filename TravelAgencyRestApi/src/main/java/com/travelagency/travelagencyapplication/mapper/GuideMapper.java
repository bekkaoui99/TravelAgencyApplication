package com.travelagency.travelagencyapplication.mapper;

import com.travelagency.travelagencyapplication.collection.Guide;
import com.travelagency.travelagencyapplication.collection.User;
import com.travelagency.travelagencyapplication.dto.request.UserRequest;
import com.travelagency.travelagencyapplication.dto.response.GuideResponse;
import com.travelagency.travelagencyapplication.dto.response.UserResponse;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class GuideMapper extends DtoMapperImpl<Guide, UserRequest, GuideResponse> {

    public GuideMapper(ModelMapper modelMapper) {
        super(modelMapper, Guide.class, GuideResponse.class);
    }

}
