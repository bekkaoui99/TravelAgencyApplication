package com.travelagency.travelagencyapplication.mapper;

import com.travelagency.travelagencyapplication.collection.Companion;
import com.travelagency.travelagencyapplication.dto.request.CompanionRequest;
import com.travelagency.travelagencyapplication.dto.response.CompanionResponse;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
    public class CompanionMapper extends DtoMapperImpl<Companion, CompanionRequest, CompanionResponse> {

    public CompanionMapper(ModelMapper modelMapper) {
        super(modelMapper, Companion.class, CompanionResponse.class);
    }

}
