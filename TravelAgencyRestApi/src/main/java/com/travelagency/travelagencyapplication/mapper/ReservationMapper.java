package com.travelagency.travelagencyapplication.mapper;

import com.travelagency.travelagencyapplication.collection.*;
import com.travelagency.travelagencyapplication.dto.request.CompanionRequest;
import com.travelagency.travelagencyapplication.dto.request.ReservationRequest;
import com.travelagency.travelagencyapplication.dto.response.ReservationResponse;
import com.travelagency.travelagencyapplication.exception.ResourceNotFoundException;
import com.travelagency.travelagencyapplication.repository.ClientRepository;
import com.travelagency.travelagencyapplication.repository.CompanionRepository;
import com.travelagency.travelagencyapplication.repository.HotelRepository;
import com.travelagency.travelagencyapplication.repository.TravelRepository;
import com.travelagency.travelagencyapplication.service.IClientService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReservationMapper implements IDtoMapper<Reservation , ReservationRequest , ReservationResponse>{

    private final TravelRepository travelRepository;
    private final HotelRepository hotelRepository;
    private final CompanionRepository companionRepository;
    private final ClientRepository clientRepository;
    private final IClientService clientService;
    private final ModelMapper modelMapper;

    public ReservationMapper(TravelRepository travelRepository,
                             HotelRepository hotelRepository, CompanionRepository companionRepository, ClientRepository clientRepository,
                             IClientService clientService,
                             ModelMapper modelMapper
    ) {
        this.travelRepository = travelRepository;
        this.hotelRepository = hotelRepository;
        this.companionRepository = companionRepository;
        this.clientRepository = clientRepository;
        this.clientService = clientService;
        this.modelMapper = modelMapper;
    }


    @Override
    public Reservation dtoRequestToEntity(ReservationRequest reservationRequest) {

        Travel travel = this.travelRepository.findById(reservationRequest.getTravelId())
                .orElseThrow(() -> new ResourceNotFoundException("travel doesn't exist with this ID : " + reservationRequest.getTravelId()));

        travel.setReservedSeat(travel.getReservedSeat() != null ? travel.getReservedSeat() : 0 );

        Hotel hotel = this.hotelRepository.findById(reservationRequest.getHotelId())
                .orElseThrow(() -> new ResourceNotFoundException("hotel doesn't exist with this ID : " + reservationRequest.getHotelId()));

        Client client = this.clientService.findClientById(reservationRequest.getClientId());

        if (travel.getClients() != null && !reservationRequest.isUpdatedMethod()) {
            boolean isReserved = travel.getClients()
                    .stream()
                    .anyMatch(clientWhoHasBeenReserved -> clientWhoHasBeenReserved.getId().equals(client.getId()));
            if (isReserved) throw new RuntimeException("Client Already Reserved this Travel .");
        }

        Set<Companion> companions = new HashSet<>();
        int totalClient = 1;

        if (reservationRequest.getCompanionsId() != null){
            for (String companionId : reservationRequest.getCompanionsId()){
                Companion companion = this.companionRepository.findById(companionId)
                        .orElseThrow(() -> new ResourceNotFoundException("companion doesn't exist with this id : " + companionId));

                companions.add(companion);
                totalClient++;
            }
        }


        Double basedPrice = travel.getBasedPrice();
        Pack travelPack = travel.getPacks()
                .stream()
                .filter(pack -> pack.getName().equals(reservationRequest.getPackName()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Pack doesn't exist with this Name : " + reservationRequest.getPackName()));

        double additionalPrice = travelPack.getAdditionalPrice();
        double travelPrice = (basedPrice + additionalPrice) * totalClient;
        // Check if a valid discount is provided
        if (reservationRequest.getDiscount() != null && reservationRequest.getDiscount() > 0) {
            // Apply the discount
            double discountPercentage = reservationRequest.getDiscount() / 100.0;
            travelPrice = travelPrice * (1 - discountPercentage); // Apply the discount
        }

        this.travelRepository.save(travel);

        return Reservation.builder()
                .reservationCode(travel.getId() + "_" + client.getId())
                .paymentType(reservationRequest.getPaymentType())
                .paymentStatus(reservationRequest.getPaymentStatus())
                .hotel(hotel)
                .hosting(reservationRequest.getHosting())
                .travel(travel)
                .client(client)
                .companions(companions)
                .pack(travelPack)
                .travelPrice(travelPrice)
                .discount(reservationRequest.getDiscount())
                .build();
    }

    @Override
    public ReservationResponse entityToDtoResponse(Reservation reservation) {
        return this.modelMapper.map(reservation , ReservationResponse.class);
    }

    @Override
    public Reservation updateEntityFields(ReservationRequest reservationRequest ,Reservation reservation) {
        System.out.println(reservationRequest.getCompanionsId());
        reservationRequest.setUpdatedMethod(true);
        Reservation updatedReservation = this.dtoRequestToEntity(reservationRequest);
        updatedReservation.setId(reservation.getId());
        System.out.println("update reservation");
        updatedReservation.getCompanions().forEach(companion -> System.out.println(companion.getFirstName()));
        return updatedReservation;
    }

}
