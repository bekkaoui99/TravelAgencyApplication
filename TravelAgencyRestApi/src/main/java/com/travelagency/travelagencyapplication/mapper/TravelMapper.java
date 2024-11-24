package com.travelagency.travelagencyapplication.mapper;

import com.travelagency.travelagencyapplication.collection.*;
import com.travelagency.travelagencyapplication.dto.request.DayTripRequest;
import com.travelagency.travelagencyapplication.dto.request.TravelRequest;
import com.travelagency.travelagencyapplication.dto.response.DayTripResponse;
import com.travelagency.travelagencyapplication.dto.response.TravelResponse;
import com.travelagency.travelagencyapplication.exception.ResourceNotFoundException;
import com.travelagency.travelagencyapplication.repository.DayTripRepository;
import com.travelagency.travelagencyapplication.repository.GuideRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TravelMapper implements IDtoMapper<Travel, TravelRequest, TravelResponse> {


    private final GuideRepository guideRepository;
    private final DayTripRepository dayTripRepository;
    private final IDtoMapper<DayTrip, DayTripRequest, DayTripResponse> dayTripMapper;
    private final ModelMapper modelMapper;

    public TravelMapper(GuideRepository guideRepository, DayTripRepository dayTripRepository, IDtoMapper<DayTrip, DayTripRequest, DayTripResponse> dayTripMapper, ModelMapper modelMapper) {
        this.guideRepository = guideRepository;
        this.dayTripRepository = dayTripRepository;
        this.dayTripMapper = dayTripMapper;
        this.modelMapper = modelMapper;
    }

    @Override
    public Travel dtoRequestToEntity(TravelRequest travelRequest) {
        Guide guide = this.guideRepository.findById(travelRequest.getTravelGuideId())
                .orElseThrow(() -> new ResourceNotFoundException("guide doesn't exist with this Id :" + travelRequest.getTravelGuideId()));

        Set<DayTrip> dayTrips = new HashSet<>();
        if(travelRequest.getTravelDayTripRequests() != null)
            travelRequest.getTravelDayTripRequests().forEach(travelDayTripRequest -> {
                DayTrip dayTrip = this.dayTripRepository.findById(travelDayTripRequest.getDayTripId())
                        .orElseThrow(() -> new ResourceNotFoundException("travel doesn't exist with this Id :" + travelDayTripRequest.getDayTripId()));
                dayTrip.setDayTripDate(travelDayTripRequest.getDayTripDate());
                dayTrips.add(dayTrip);
            });

        return Travel.builder()
                .title(travelRequest.getTitle())
                .destination(travelRequest.getDestination())
                .startDate(travelRequest.getStartDate())
                .endDate(travelRequest.getEndDate())
                .travelGuide(guide)
                .packs(
                        travelRequest.getPacks()
                        .stream()
                        .map(packRequest -> modelMapper.map(packRequest , Pack.class))
                        .collect(Collectors.toSet())
                )
                .dayTrips(
                        dayTrips
//                        travelRequest.getDayTrips()
//                                .stream()
//                                .map(dayTripMapper::dtoRequestToEntity)
//                                .collect(Collectors.toSet())
                )
                .travelState(travelRequest.getTravelState())
                .transportType(travelRequest.getTransportType())
                .transportCompany(travelRequest.getTransportCompany())
                .maxSeat(travelRequest.getMaxSeat())
                .basedPrice(travelRequest.getBasedPrice())
                .shortDescription(travelRequest.getShortDescription())
                .longDescription(travelRequest.getLongDescription())
                .build();

    }

    @Override
    public TravelResponse entityToDtoResponse(Travel travel) {
        return this.modelMapper.map(travel , TravelResponse.class);
    }

    @Override
    public Travel updateEntityFields(TravelRequest travelRequest, Travel travel) {
        Travel updatedTravelFields = this.dtoRequestToEntity(travelRequest);
        updatedTravelFields.setId(travel.getId());
        updatedTravelFields.setReservedSeat(travel.getReservedSeat());
        updatedTravelFields.setClients(travel.getClients());
        return updatedTravelFields;
    }
}
