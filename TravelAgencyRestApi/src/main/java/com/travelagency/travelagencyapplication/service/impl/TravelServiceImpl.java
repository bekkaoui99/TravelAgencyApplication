package com.travelagency.travelagencyapplication.service.impl;

import com.travelagency.travelagencyapplication.collection.*;
import com.travelagency.travelagencyapplication.dto.request.TravelRequest;
import com.travelagency.travelagencyapplication.dto.response.DayTripResponse;
import com.travelagency.travelagencyapplication.dto.response.TravelResponse;
import com.travelagency.travelagencyapplication.enums.TravelState;
import com.travelagency.travelagencyapplication.exception.ResourceAlreadyExistException;
import com.travelagency.travelagencyapplication.exception.ResourceNotFoundException;
import com.travelagency.travelagencyapplication.mapper.IDtoMapper;
import com.travelagency.travelagencyapplication.repository.ClientRepository;
import com.travelagency.travelagencyapplication.repository.GuideRepository;
import com.travelagency.travelagencyapplication.repository.ReservationRepository;
import com.travelagency.travelagencyapplication.repository.TravelRepository;
import com.travelagency.travelagencyapplication.service.IFileStorageService;
import com.travelagency.travelagencyapplication.service.ITravelService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TravelServiceImpl implements ITravelService {

    private final ReservationRepository reservationRepository;
    private final TravelRepository travelRepository;
    private final ClientRepository clientRepository;
    private final GuideRepository guideRepository;
    private final IFileStorageService fileStorageService;
    private final IDtoMapper<Travel , TravelRequest , TravelResponse> travelMapper;
    private final MongoTemplate mongoTemplate;


    public TravelServiceImpl(
            ReservationRepository reservationRepository, TravelRepository travelRepository, ClientRepository clientRepository,
            GuideRepository guideRepository,
            IFileStorageService fileStorageService,
            IDtoMapper<Travel, TravelRequest, TravelResponse> travelMapper,
            MongoTemplate mongoTemplate
    ) {
        this.reservationRepository = reservationRepository;
        this.travelRepository = travelRepository;
        this.clientRepository = clientRepository;
        this.guideRepository = guideRepository;
        this.fileStorageService = fileStorageService;
        this.travelMapper = travelMapper;
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public TravelResponse create(TravelRequest travelRequest) {
        Travel travel = this.travelMapper.dtoRequestToEntity(travelRequest);
        Travel createdTravel = this.travelRepository.save(travel);
        return this.travelMapper.entityToDtoResponse(createdTravel);
    }

    public Travel createTravel(TravelRequest travelRequest) {
        Travel travel = this.travelMapper.dtoRequestToEntity(travelRequest);
        return this.travelRepository.save(travel);
    }

    @Override
    public TravelResponse update(TravelRequest travelRequest, String id) {
        Set<String> allTravelImagesUrl = new HashSet<>();
        Travel travelById = this.getTravelById(id);

        Travel updatedTravelFields = this.travelMapper.updateEntityFields(travelRequest, travelById);

        if(travelRequest.getImagesUrl() != null) {
            allTravelImagesUrl.addAll(travelRequest.getImagesUrl());
        }

        updatedTravelFields.setImagesUrl(allTravelImagesUrl);
        Travel updatedTravel = this.travelRepository.save(updatedTravelFields);

        return this.travelMapper.entityToDtoResponse(updatedTravel);
    }

    @Override
    public TravelResponse uploadTravelImages(String travelId , Set<MultipartFile> travelImages) {
        Travel travel = this.travelRepository.findById(travelId)
                .orElseThrow(() -> new ResourceNotFoundException("travel doesn't exist with this id : " + travelId));

        Set<String> allTravelImagesUrl = new HashSet<>();
        if(travel.getImagesUrl() != null){
            allTravelImagesUrl.addAll(travel.getImagesUrl());
        }
        if(travelImages != null){
            Set<String> uploadedTravelImagesUrl = this.fileStorageService.uploadFile(travelImages);
            allTravelImagesUrl.addAll(uploadedTravelImagesUrl);
        }
        travel.setImagesUrl(allTravelImagesUrl);
        Travel updatedTravel = this.travelRepository.save(travel);
        return this.travelMapper.entityToDtoResponse(updatedTravel);

    }


    @Override
    public TravelResponse findOne(String id) {
        Travel travelById = this.getTravelById(id);
        return this.travelMapper.entityToDtoResponse(travelById);
    }

    @Override
    public List<TravelResponse> findAll() {
        return this.travelRepository.findAll()
                .stream()
                .map(travelMapper::entityToDtoResponse)
                .toList();
    }

    public Page<TravelResponse> filterTravels(String title,
                                      String destination,
                                      Date startDate,
                                      String travelGuideName,
                                      TravelState travelState,
                                      Pageable pageable)
    {
        Criteria criteria = new Criteria();

        if (title != null && !title.isEmpty()) {
            criteria.and("title").is(title);
        }
        if (destination != null && !destination.isEmpty()) {
            criteria.and("destination").is(destination);
        }
        if (startDate != null) {
            criteria.and("startDate").is(startDate);
        }
        if (travelGuideName != null && !travelGuideName.isEmpty()) {
            Optional<Guide> travelGuideByRoleAndUserName = guideRepository.findByUserName(travelGuideName);

            if (travelGuideByRoleAndUserName.isPresent()) {
                criteria.and("travelGuide").is(travelGuideByRoleAndUserName.get());
            } else {
                // No matching user found, return an empty page
                return new PageImpl<>(List.of(), pageable, 0);
            }
        }
        if (travelState != null) {
            criteria.and("travelState").is(travelState);
        }

        Query query = new Query(criteria).with(pageable);
        List<Travel> travels = mongoTemplate.find(query, Travel.class);

        List<TravelResponse> travelResponses = this.travelMapper.entitiesToListDtoResponse(travels);

        // Count total documents matching the criteria (without pagination)
        long count = mongoTemplate.count(query.skip(0).limit(0), Travel.class);

        return new PageImpl<>(travelResponses, pageable, count);
    }

    @Override
    public Page<TravelResponse> findAll(int pageNumber, int pageSize) {
        Page<Travel> travelPage = this.travelRepository.findAll(PageRequest.of(pageNumber, pageSize));
        List<TravelResponse> travelResponseList = travelPage.getContent()
                .stream()
                .map(travelMapper::entityToDtoResponse)
                .toList();

        return new PageImpl<>(travelResponseList , travelPage.getPageable() , travelPage.getTotalElements());
    }

    @Override
    public boolean delete(String id) {
        Travel travelById = this.getTravelById(id);
        this.travelRepository.delete(travelById);
        if(travelById.getImagesUrl() != null)
            this.fileStorageService.deleteFile(travelById.getImagesUrl());
        return true;
    }

    private Travel getTravelById(String id){
        return this.travelRepository.findById(id)
                .orElseThrow(() -> new ResourceAlreadyExistException("Travel doesn't exist with this ID : " + id));
    }

    @Override
    public TravelResponse cloneTravel(String travelId) {
        Travel travelById = this.getTravelById(travelId);
        travelById.setId(null);
        travelById.setClients(null);
        travelById.setReservedSeat(0);
        travelById.setTitle(travelById.getTitle() + " #copy");
        Travel clonedTravel = this.travelRepository.save(travelById);
        return this.travelMapper.entityToDtoResponse(clonedTravel);
    }


    @Override
    public TravelResponse cloneTravel(TravelRequest travelRequest) {
        Set<String> allTravelImagesUrl = new HashSet<>();

        Travel travel = this.travelMapper.dtoRequestToEntity(travelRequest);

        if(travel.getImagesUrl() != null) {
            allTravelImagesUrl.addAll(travel.getImagesUrl());
        }
        travel.setImagesUrl(allTravelImagesUrl);
        travel.setId(UUID.randomUUID().toString());
        Travel updatedTravel = this.travelRepository.save(travel);

        return this.travelMapper.entityToDtoResponse(updatedTravel);
    }


    @Override
    public void addClientToTravelList(Travel travel, Client client, Set<Companion> companions) {
        int totalClients = 1;  // Start with 1 for the main client

        if (companions != null) {
            totalClients += companions.size();  // Add the number of companions to total clients
        }

        // Check if there are enough seats
        if (travel.getMaxSeat() < travel.getReservedSeat() + totalClients) {
            throw new RuntimeException("All seats have been reserved.");
        }

        // Handle the case where the client list is null (for the first reservation)
        Set<Client> clients = travel.getClients() != null ? new HashSet<>(travel.getClients()) : new HashSet<>();
        clients.add(client);

        // Handle the case where the Companion list is null (for the first reservation)
        Set<Companion> clientCompanions = travel.getCompanions() != null ? new HashSet<>(travel.getCompanions()) : new HashSet<>();
        clientCompanions.addAll(companions);



        // Update the reserved seat count
        travel.setReservedSeat(travel.getReservedSeat() + totalClients);

        // Set updated clients and save the travel
        travel.setClients(clients);
        travel.setCompanions(clientCompanions);
        this.travelRepository.save(travel);
    }

    @Override
    public TravelResponse canceledReservation(String travelId, String clientId) {

        // Fetch the travel entity
        Travel travel = this.travelRepository.findById(travelId)
                .orElseThrow(() -> new ResourceNotFoundException("Travel doesn't exist with this ID: " + travelId));

        // Fetch the client entity
        Client canceledClient = this.clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client doesn't exist with this ID: " + clientId));


        // Generate reservation code
        String reservationCode = travel.getId() + "_" + canceledClient.getId();

        // Fetch the reservation
        Reservation reservation = this.reservationRepository.findByReservationCode(reservationCode)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation doesn't exist with this ID: " + travelId));


        // Initialize clients set if null
        if (travel.getClients() == null) {
            travel.setClients(new HashSet<>());
        }

        // Initialize Companions set if null
        if (travel.getCompanions() == null) {
            travel.setCompanions(new HashSet<>());
        }

        // Initialize canceled reservations set if null
        if (travel.getCanceledReservations() == null) {
            travel.setCanceledReservations(new HashSet<>());
        }


        // Remove the canceled client from the current client list of the travel
        Set<Client> updatedClientList = new HashSet<>(travel.getClients());
        updatedClientList.removeIf(client -> client.getId().equals(canceledClient.getId()));
        travel.setClients(updatedClientList);

        // Remove the canceled companion from the current companion list of the travel
        Set<Companion> updatedClientCompanionList = new HashSet<>(travel.getCompanions());
        updatedClientCompanionList.removeIf(companion ->
                reservation.getCompanions().stream()
                        .anyMatch(resCompanion -> resCompanion.getId().equals(companion.getId())));
        travel.setCompanions(updatedClientCompanionList);

        // Add the client to the canceled reservations set
        Set<Client> canceledClientList = new HashSet<>(travel.getCanceledReservations());
        canceledClientList.add(canceledClient);
        travel.setCanceledReservations(canceledClientList);

        travel.setReservedSeat(travel.getReservedSeat() - (  1 + reservation.getCompanions().size() ) );

        // Save the updated travel entity
        travelRepository.save(travel);

        // Delete the reservation record
        reservationRepository.delete(reservation);

        // Return the updated travel response
        return travelMapper.entityToDtoResponse(travel);
    }


}
