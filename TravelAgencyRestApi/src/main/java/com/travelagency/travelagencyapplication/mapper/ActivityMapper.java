package com.travelagency.travelagencyapplication.mapper;

import com.travelagency.travelagencyapplication.collection.Activity;
import com.travelagency.travelagencyapplication.collection.Guide;
import com.travelagency.travelagencyapplication.dto.request.ActivityRequest;
import com.travelagency.travelagencyapplication.dto.response.ActivityResponse;
import com.travelagency.travelagencyapplication.enums.ActivityCostType;
import com.travelagency.travelagencyapplication.exception.ResourceNotFoundException;
import com.travelagency.travelagencyapplication.repository.GuideRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class ActivityMapper implements IDtoMapper<Activity, ActivityRequest, ActivityResponse> {

    private final GuideRepository guideRepository;
    private final ModelMapper modelMapper;

    public ActivityMapper(GuideRepository guideRepository, ModelMapper modelMapper) {
        this.guideRepository = guideRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public Activity dtoRequestToEntity(ActivityRequest activityRequest) {
        Guide guide = this.guideRepository.findById(activityRequest.getActivityGuideId())
                .orElseThrow(() -> new ResourceNotFoundException("guide doesn't exist with this Id :" + activityRequest.getActivityGuideId()));

        Activity activity = Activity.builder()
                .title(activityRequest.getTitle())
                .destination(activityRequest.getDestination())
                .activityType(activityRequest.getActivityType())
                .activityCostType(activityRequest.getActivityCostType())
                .shortDescription(activityRequest.getShortDescription())
                .longDescription(activityRequest.getLongDescription())
                .activityGuide(guide)
                .build();
        if(activityRequest.getActivityCostType().equals(ActivityCostType.EXTRA_COST)){
            activity.setActivityAdditionalPrice(activityRequest.getActivityAdditionalPrice());
        }
        return activity;
    }

    @Override
    public ActivityResponse entityToDtoResponse(Activity activity) {
        return this.modelMapper.map(activity , ActivityResponse.class);
    }

    @Override
    public Activity updateEntityFields(ActivityRequest activityRequest , Activity activity) {
        Activity updatedActivity = this.dtoRequestToEntity(activityRequest);
        updatedActivity.setId(activity.getId());
        return updatedActivity;
    }
}
