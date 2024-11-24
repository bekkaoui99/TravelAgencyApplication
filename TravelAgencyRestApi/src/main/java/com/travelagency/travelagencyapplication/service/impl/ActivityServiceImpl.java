package com.travelagency.travelagencyapplication.service.impl;

import com.travelagency.travelagencyapplication.collection.Activity;
import com.travelagency.travelagencyapplication.dto.request.ActivityRequest;
import com.travelagency.travelagencyapplication.dto.response.ActivityResponse;
import com.travelagency.travelagencyapplication.exception.ResourceNotFoundException;
import com.travelagency.travelagencyapplication.mapper.IDtoMapper;
import com.travelagency.travelagencyapplication.repository.ActivityRepository;
import com.travelagency.travelagencyapplication.service.IActivityService;
import com.travelagency.travelagencyapplication.service.IFileStorageService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;


@Service
public class ActivityServiceImpl implements IActivityService
{

    private final ActivityRepository activityRepository;
    private final IFileStorageService fileStorageService;
    private final IDtoMapper<Activity , ActivityRequest , ActivityResponse> activityMapper;

    public ActivityServiceImpl(ActivityRepository activityRepository, IFileStorageService fileStorageService, IDtoMapper<Activity, ActivityRequest, ActivityResponse> activityMapper) {
        this.activityRepository = activityRepository;
        this.fileStorageService = fileStorageService;
        this.activityMapper = activityMapper;
    }


    @Override
    public ActivityResponse getActivityByName(String name) {
        Activity activity = activityRepository.findByTitle(name)
                .orElseThrow(() -> new ResourceNotFoundException("activity doesn't exist with this name :" + name));

        return activityMapper.entityToDtoResponse(activity);
    }

    @Override
    public ActivityResponse cloneActivity(String activityId) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("activity doesn't exist with this Id :" + activityId));

        activity.setId(UUID.randomUUID().toString());
        activity.setTitle(activity.getTitle() + " #copy");
        Activity clonedActivity = this.activityRepository.save(activity);
        return this.activityMapper.entityToDtoResponse(clonedActivity);
    }

    @Override
    public ActivityResponse cloneActivity(ActivityRequest activityRequest) {
        Activity activity = this.activityMapper.dtoRequestToEntity(activityRequest);
        activity.setId(UUID.randomUUID().toString());
        Set<String> allImagesUrl = new HashSet<>();
        if (activityRequest.getImagesUrl() != null) {
            allImagesUrl.addAll(activityRequest.getImagesUrl());
        }
        if (activityRequest.getImagesFile() != null) {
            Set<String> uploadedImages = this.fileStorageService.uploadFile(activityRequest.getImagesFile());
            allImagesUrl.addAll(uploadedImages);
        }
        activity.setImagesUrl(allImagesUrl);
        Activity clonedActivity = this.activityRepository.save(activity);
        return this.activityMapper.entityToDtoResponse(clonedActivity);
    }

    @Override
    public ActivityResponse updateActivity(String activityId, ActivityRequest activityRequest, Set<MultipartFile> activityImagesFile) {
        return null;
    }


    @Override
    public ActivityResponse create(ActivityRequest activityRequest) {
        Set<String> images = new HashSet<>();
        if (activityRequest.getImagesFile() != null)
            images = this.fileStorageService.uploadFile(activityRequest.getImagesFile());

        Activity activity = this.activityMapper.dtoRequestToEntity(activityRequest);
        activity.setImagesUrl(images);
        Activity created = this.activityRepository.save(activity);
        return this.activityMapper.entityToDtoResponse(created);
    }

    @Override
    public ActivityResponse update(ActivityRequest activityRequest, String id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity doesn't exist with this ID: " + id));

        // Get the existing image URLs from the activity
        Set<String> existingImages = new HashSet<>(activity.getImagesUrl());

        // Get the updated image URLs from the request
        Set<String> updatedImages = new HashSet<>(activityRequest.getImagesUrl() != null ? activityRequest.getImagesUrl() : Collections.emptySet());

        // Determine which images need to be removed (present in existing but not in updated)
        Set<String> imagesToRemove = new HashSet<>(existingImages);
        imagesToRemove.removeAll(updatedImages);

        // Delete the removed images
        if (!imagesToRemove.isEmpty()) {
            fileStorageService.deleteFile(imagesToRemove);
        }

        // Upload new images and collect their URLs
        Set<String> addedImages = new HashSet<>();
        if (activityRequest.getImagesFile() != null) {
            addedImages = fileStorageService.uploadFile(activityRequest.getImagesFile());
        }

        // Update the activity with the new list of images
        Set<String> finalImages = new HashSet<>(updatedImages);
        finalImages.addAll(addedImages);

        Activity updatedActivity = activityMapper.updateEntityFields(activityRequest, activity);
        updatedActivity.setImagesUrl(finalImages);

        Activity savedActivity = activityRepository.save(updatedActivity);
        return activityMapper.entityToDtoResponse(savedActivity);
    }


    @Override
    public ActivityResponse findOne(String id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("activity doesn't exist with this ID :" + id));

        return this.activityMapper.entityToDtoResponse(activity);
    }

    @Override
    public List<ActivityResponse> findAll() {
        return  this.activityRepository.findAll().stream()
                .map(activityMapper::entityToDtoResponse)
                .toList();
    }

    @Override
    public Page<ActivityResponse> findAll(int pageNumber, int pageSize) {
        Page<Activity> activityPage = this.activityRepository.findAll(PageRequest.of(pageNumber, pageSize));
        List<ActivityResponse> activityResponseList = activityPage.getContent()
                .stream()
                .map(activityMapper::entityToDtoResponse)
                .toList();

        return new PageImpl<>(activityResponseList , activityPage.getPageable() , activityPage.getTotalElements());
    }

    @Override
    public boolean delete(String id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("activity doesn't exist with this ID :" + id));
        this.activityRepository.delete(activity);
        if(activity.getImagesUrl() != null)
            this.fileStorageService.deleteFile(activity.getImagesUrl());
        return true;
    }

    @Override
    public Long getActivityNumber() {
        return this.activityRepository.count();
    }

} 
