package com.travelagency.travelagencyapplication.mapper;

import com.travelagency.travelagencyapplication.collection.Activity;
import com.travelagency.travelagencyapplication.collection.DayTrip;
import com.travelagency.travelagencyapplication.collection.Guide;
import com.travelagency.travelagencyapplication.dto.request.ActivityRequest;
import com.travelagency.travelagencyapplication.dto.request.DayTripActivityRequest;
import com.travelagency.travelagencyapplication.dto.request.DayTripRequest;
import com.travelagency.travelagencyapplication.dto.response.ActivityResponse;
import com.travelagency.travelagencyapplication.dto.response.DayTripResponse;
import com.travelagency.travelagencyapplication.exception.ResourceNotFoundException;
import com.travelagency.travelagencyapplication.repository.ActivityRepository;
import com.travelagency.travelagencyapplication.repository.GuideRepository;
import com.travelagency.travelagencyapplication.service.IActivityService;
import com.travelagency.travelagencyapplication.service.IFileStorageService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class DayTripMapper implements IDtoMapper<DayTrip, DayTripRequest, DayTripResponse> {

    private final GuideRepository guideRepository;
    private final ActivityRepository activityRepository;
    private final IDtoMapper<Activity, ActivityRequest, ActivityResponse> activityMapper;
    private final ModelMapper modelMapper;

    public DayTripMapper(GuideRepository guideRepository, ActivityRepository activityRepository, IDtoMapper<Activity, ActivityRequest, ActivityResponse> activityMapper,
                         ModelMapper modelMapper) {
        this.guideRepository = guideRepository;
        this.activityRepository = activityRepository;
        this.activityMapper = activityMapper;
        this.modelMapper = modelMapper;
    }

    @Override
    public DayTrip dtoRequestToEntity(DayTripRequest dayTripRequest) {
        Guide guide = this.guideRepository.findById(dayTripRequest.getActivityGuideId())
                .orElseThrow(() -> new ResourceNotFoundException("guide doesn't exist with this Id :" + dayTripRequest.getActivityGuideId()));


        Set<Activity> activities = new HashSet<>();
        for (DayTripActivityRequest dayTripActivityRequest : dayTripRequest.getActivities()){
            Activity activity = activityRepository.findById(dayTripActivityRequest.getActivityId())
                    .orElseThrow(() -> new ResourceNotFoundException("activity doesn't exist with this ID :" + dayTripActivityRequest.getActivityId()));
            activity.setStartAt(dayTripActivityRequest.getStartAt());
            activity.setEndAt(dayTripActivityRequest.getEndAt());
            activities.add(activity);
        }
        System.out.println("activities: ");
        activities.forEach(System.out::println);

        return DayTrip.builder()
                .title(dayTripRequest.getTitle())
                .destination(dayTripRequest.getDestination())
                .dayTripDate(dayTripRequest.getDayTripDate())
                .status(dayTripRequest.getStatus())
                .shortDescription(dayTripRequest.getShortDescription())
                .longDescription(dayTripRequest.getLongDescription())
                .activities(activities)
                .dayTripGuide(guide)
                .build();
    }

    @Override
    public DayTripResponse entityToDtoResponse(DayTrip dayTrip) {
        return this.modelMapper.map(dayTrip , DayTripResponse.class);
    }

    @Override
    public DayTrip updateEntityFields(DayTripRequest dayTripRequest, DayTrip dayTrip) {
        DayTrip updatedDayTripFields = this.dtoRequestToEntity(dayTripRequest);
        updatedDayTripFields.setId(dayTrip.getId());
        return updatedDayTripFields;
    }
}
