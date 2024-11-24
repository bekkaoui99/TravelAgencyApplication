package com.travelagency.travelagencyapplication.service;

import com.travelagency.travelagencyapplication.dto.request.DayTripRequest;
import com.travelagency.travelagencyapplication.dto.response.DayTripResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

public interface IDayTripService extends CrudService<DayTripRequest , DayTripResponse , String>{

     DayTripResponse createDayTrip(DayTripRequest dayTripRequest);
     DayTripResponse uploadDayTripImages(String dayTripId , Set<MultipartFile> dayTripImages);
     DayTripResponse cloneDayTrip(String dayTripId);
     DayTripResponse cloneDayTrip(DayTripRequest dayTripRequest);
}
