package com.travelagency.travelagencyapplication.service;

import com.travelagency.travelagencyapplication.dto.request.HotelRequest;
import com.travelagency.travelagencyapplication.dto.response.HotelResponse;

import java.util.List;

public interface IHotelService extends CrudService<HotelRequest, HotelResponse , String>{

    List<HotelResponse> findHotelsByHotelName(String hotelName);
    HotelResponse findHotelByHotelName(String hotelName);
    HotelResponse cloneHotel(String hotelId);
    HotelResponse cloneHotel(HotelRequest hotelRequest);

}
