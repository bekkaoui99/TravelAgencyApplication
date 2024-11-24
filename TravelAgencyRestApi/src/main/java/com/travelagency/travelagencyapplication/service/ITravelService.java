package com.travelagency.travelagencyapplication.service;


import com.travelagency.travelagencyapplication.collection.Client;
import com.travelagency.travelagencyapplication.collection.Companion;
import com.travelagency.travelagencyapplication.collection.Travel;
import com.travelagency.travelagencyapplication.dto.request.TravelRequest;
import com.travelagency.travelagencyapplication.dto.response.TravelResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

public interface ITravelService extends CrudService<TravelRequest, TravelResponse, String>{
    Travel createTravel(TravelRequest travelRequest);
    TravelResponse cloneTravel(String travelId);
    TravelResponse cloneTravel(TravelRequest travelRequest);
    void addClientToTravelList(Travel travel, Client client , Set<Companion> companions);
    TravelResponse uploadTravelImages(String travelId , Set<MultipartFile> travelImages);
    TravelResponse canceledReservation(String travelId , String clientId);
}
