package com.travelagency.travelagencyapplication.service;

import com.travelagency.travelagencyapplication.dto.request.ActivityRequest;
import com.travelagency.travelagencyapplication.dto.request.ReservationRequest;
import com.travelagency.travelagencyapplication.dto.response.ActivityResponse;
import com.travelagency.travelagencyapplication.dto.response.ReservationResponse;

public interface IReservationService extends CrudService<ReservationRequest, ReservationResponse, String>{

    ReservationResponse getClientReservation(String travelId , String clientId);
}
