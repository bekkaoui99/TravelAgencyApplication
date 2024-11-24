package com.travelagency.travelagencyapplication.mapper;

import com.travelagency.travelagencyapplication.collection.Hotel;
import com.travelagency.travelagencyapplication.dto.request.HotelRequest;
import com.travelagency.travelagencyapplication.dto.response.HotelResponse;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class HotelMapper extends DtoMapperImpl<Hotel, HotelRequest, HotelResponse> {

    public HotelMapper(ModelMapper modelMapper) {
        super(modelMapper, Hotel.class, HotelResponse.class);
    }
}
