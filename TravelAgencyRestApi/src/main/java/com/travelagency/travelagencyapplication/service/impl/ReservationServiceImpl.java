package com.travelagency.travelagencyapplication.service.impl;

import com.travelagency.travelagencyapplication.collection.Client;
import com.travelagency.travelagencyapplication.collection.Reservation;
import com.travelagency.travelagencyapplication.collection.Travel;
import com.travelagency.travelagencyapplication.dto.request.ReservationRequest;
import com.travelagency.travelagencyapplication.dto.response.ReservationResponse;
import com.travelagency.travelagencyapplication.dto.response.TravelResponse;
import com.travelagency.travelagencyapplication.exception.ResourceNotFoundException;
import com.travelagency.travelagencyapplication.mapper.IDtoMapper;
import com.travelagency.travelagencyapplication.repository.ClientRepository;
import com.travelagency.travelagencyapplication.repository.ReservationRepository;
import com.travelagency.travelagencyapplication.repository.TravelRepository;
import com.travelagency.travelagencyapplication.service.IReservationService;
import com.travelagency.travelagencyapplication.service.ITravelService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;


@Service
public class ReservationServiceImpl implements IReservationService {


    private final ReservationRepository reservationRepository;
    private final TravelRepository travelRepository;
    private final ClientRepository clientRepository;
    private final ITravelService travelService;
    private final IDtoMapper<Reservation, ReservationRequest , ReservationResponse> reservationMapper;

    public ReservationServiceImpl(
            ReservationRepository reservationRepository, TravelRepository travelRepository, ClientRepository clientRepository, ITravelService travelService,
            IDtoMapper<Reservation, ReservationRequest, ReservationResponse> reservationMapper
    ) {
        this.reservationRepository = reservationRepository;
        this.travelRepository = travelRepository;
        this.clientRepository = clientRepository;
        this.travelService = travelService;
        this.reservationMapper = reservationMapper;
    }


    @Override
    @Transactional
    public ReservationResponse create(ReservationRequest reservationRequest) {
        Reservation reservation = this.reservationMapper.dtoRequestToEntity(reservationRequest);
        Reservation createdReservation = this.reservationRepository.save(reservation);

        this.travelService.addClientToTravelList(createdReservation.getTravel() , createdReservation.getClient() , createdReservation.getCompanions());

        return this.reservationMapper.entityToDtoResponse(createdReservation);
    }

    @Override
    public ReservationResponse getClientReservation(String travelId , String clientId){
        String reservationCode = travelId + "_" + clientId;
        Reservation reservation = this.reservationRepository.findByReservationCode(reservationCode)
                .orElseThrow(() -> new ResourceNotFoundException("reservation doesn't exist with this reservationCode : " + reservationCode));

        return this.reservationMapper.entityToDtoResponse(reservation);
    }

    @Override
    @Transactional
    public ReservationResponse update(ReservationRequest reservationRequest, String id) {
        Reservation Reservation = this.reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("reservation doesn't exist with this ID : " + id));
        Reservation reservation = this.reservationMapper.updateEntityFields(reservationRequest , Reservation);
        Reservation createdReservation = this.reservationRepository.save(reservation);

        return this.reservationMapper.entityToDtoResponse(createdReservation);
    }

    @Override
    public ReservationResponse findOne(String id) {
        Reservation reservation = this.reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("reservation doesn't exist with this ID : " + id));

        return this.reservationMapper.entityToDtoResponse(reservation);
    }

    @Override
    public List<ReservationResponse> findAll() {
        return this.reservationRepository.findAll()
                .stream()
                .map(reservationMapper::entityToDtoResponse)
                .toList();
    }

    @Override
    public Page<ReservationResponse> findAll(int pageNumber, int pageSize) {
        Page<Reservation> reservationPage = this.reservationRepository.findAll(PageRequest.of(pageNumber, pageSize));
        List<ReservationResponse> reservationResponseList = reservationPage.getContent()
                .stream()
                .map(reservationMapper::entityToDtoResponse)
                .toList();

        return new PageImpl<>(reservationResponseList , reservationPage.getPageable() , reservationPage.getTotalElements());
    }

    @Override
    public boolean delete(String id) {
        Reservation reservation = this.reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("reservation doesn't exist with this ID : " + id));

        this.travelService.canceledReservation(reservation.getTravel().getId() , reservation.getClient().getId());
        return true;
    }


}
