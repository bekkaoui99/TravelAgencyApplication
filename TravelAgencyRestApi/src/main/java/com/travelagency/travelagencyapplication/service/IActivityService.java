package com.travelagency.travelagencyapplication.service;

import com.travelagency.travelagencyapplication.collection.Activity;
import com.travelagency.travelagencyapplication.dto.request.ActivityRequest;
import com.travelagency.travelagencyapplication.dto.request.HotelRequest;
import com.travelagency.travelagencyapplication.dto.response.ActivityResponse;
import com.travelagency.travelagencyapplication.dto.response.HotelResponse;
import com.travelagency.travelagencyapplication.dto.response.RegistrationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

public interface IActivityService extends CrudService<ActivityRequest , ActivityResponse , String>{
    ActivityResponse getActivityByName(String name);
    ActivityResponse cloneActivity(String activityId);
    ActivityResponse cloneActivity(ActivityRequest activityRequest);
    ActivityResponse updateActivity(String activityId , ActivityRequest activityRequest , Set<MultipartFile> activityImagesFile);
    Long getActivityNumber();
}
