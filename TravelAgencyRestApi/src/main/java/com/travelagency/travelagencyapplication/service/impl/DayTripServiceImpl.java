package com.travelagency.travelagencyapplication.service.impl;

import com.travelagency.travelagencyapplication.collection.Activity;
import com.travelagency.travelagencyapplication.collection.DayTrip;
import com.travelagency.travelagencyapplication.collection.Guide;
import com.travelagency.travelagencyapplication.dto.request.ActivityRequest;
import com.travelagency.travelagencyapplication.dto.request.DayTripRequest;
import com.travelagency.travelagencyapplication.dto.response.ActivityResponse;
import com.travelagency.travelagencyapplication.dto.response.DayTripResponse;
import com.travelagency.travelagencyapplication.exception.ResourceNotFoundException;
import com.travelagency.travelagencyapplication.mapper.IDtoMapper;
import com.travelagency.travelagencyapplication.repository.DayTripRepository;
import com.travelagency.travelagencyapplication.repository.GuideRepository;
import com.travelagency.travelagencyapplication.service.IDayTripService;
import com.travelagency.travelagencyapplication.service.IFileStorageService;
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

@Service
public class DayTripServiceImpl implements IDayTripService {

    private final DayTripRepository dayTripRepository;
    private final GuideRepository guideRepository;
    private final IFileStorageService fileStorageService;
    private final IDtoMapper<DayTrip , DayTripRequest , DayTripResponse> dayTripMapper;
    private final MongoTemplate mongoTemplate;



    public DayTripServiceImpl(DayTripRepository dayTripRepository, GuideRepository guideRepository, IFileStorageService fileStorageService, IDtoMapper<DayTrip, DayTripRequest, DayTripResponse> dayTripMapper, MongoTemplate mongoTemplate) {
        this.dayTripRepository = dayTripRepository;
        this.guideRepository = guideRepository;
        this.fileStorageService = fileStorageService;
        this.dayTripMapper = dayTripMapper;
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public DayTripResponse create(DayTripRequest dayTripRequest) {
        Set<String> imagesUrl = new HashSet<>();
        if(dayTripRequest.getImagesFile() != null)
            imagesUrl = this.fileStorageService.uploadFile(dayTripRequest.getImagesFile());
        DayTrip dayTrip = this.dayTripMapper.dtoRequestToEntity(dayTripRequest);
        dayTrip.setImagesUrl(imagesUrl);
        DayTrip createdDayTrip = this.dayTripRepository.save(dayTrip);

        return this.dayTripMapper.entityToDtoResponse(createdDayTrip);
    }

    @Override
    public DayTripResponse createDayTrip(DayTripRequest dayTripRequest) {
        DayTrip dayTrip = this.dayTripMapper.dtoRequestToEntity(dayTripRequest);
        DayTrip createdDayTrip = this.dayTripRepository.save(dayTrip);
        return this.dayTripMapper.entityToDtoResponse(createdDayTrip);
    }

    @Override
    public DayTripResponse uploadDayTripImages(String dayTripId , Set<MultipartFile> dayTripImages) {
        DayTrip dayTrip = this.dayTripRepository.findById(dayTripId)
                .orElseThrow(() -> new ResourceNotFoundException("Day Activity doesn't exist with this id : " + dayTripId));

        Set<String> allDayTripImagesUrl = new HashSet<>();
        if(dayTrip.getImagesUrl() != null){
            allDayTripImagesUrl.addAll(dayTrip.getImagesUrl());
        }
        if(dayTripImages != null){
            Set<String> uploadedDayTripImagesUrl = this.fileStorageService.uploadFile(dayTripImages);
            allDayTripImagesUrl.addAll(uploadedDayTripImagesUrl);
        }
        dayTrip.setImagesUrl(allDayTripImagesUrl);
        DayTrip updatedDayTrip = this.dayTripRepository.save(dayTrip);
        return this.dayTripMapper.entityToDtoResponse(updatedDayTrip);

    }

    @Override
    public DayTripResponse cloneDayTrip(String dayTripId) {
        DayTrip dayTrip = dayTripRepository.findById(dayTripId)
                .orElseThrow(() -> new ResourceNotFoundException("dayTrip doesn't exist with this Id :" + dayTripId));

        dayTrip.setId(UUID.randomUUID().toString());
        dayTrip.setTitle(dayTrip.getTitle() + " #copy");
        DayTrip clonedDayTrip = this.dayTripRepository.save(dayTrip);
        return this.dayTripMapper.entityToDtoResponse(clonedDayTrip);
    }

    @Override
    public DayTripResponse cloneDayTrip(DayTripRequest dayTripRequest) {
        DayTrip dayTrip = this.dayTripMapper.dtoRequestToEntity(dayTripRequest);
        dayTrip.setId(UUID.randomUUID().toString());
        Set<String> imagesUrl = new HashSet<>();
        if (dayTripRequest.getImagesUrl() != null) {
            imagesUrl.addAll(dayTripRequest.getImagesUrl());
        }
        dayTrip.setImagesUrl(imagesUrl);
        DayTrip clonedDayTrip = this.dayTripRepository.save(dayTrip);
        return this.dayTripMapper.entityToDtoResponse(clonedDayTrip);
    }



    private DayTrip findById(String id){
        return this.dayTripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Day Activity doesn't exist with this id : " + id));
    }
    @Override
    public DayTripResponse update(DayTripRequest dayTripRequest, String id) {
        Set<String> imagesUrl = new HashSet<>();
        DayTrip dayTrip = this.findById(id);

        if(dayTripRequest.getImagesUrl() != null)
            imagesUrl = dayTripRequest.getImagesUrl();

        DayTrip updatedActivityFields = this.dayTripMapper.updateEntityFields(dayTripRequest , dayTrip);
        updatedActivityFields.setImagesUrl(imagesUrl);
        DayTrip updatedDayTrip = this.dayTripRepository.save(updatedActivityFields);

        return this.dayTripMapper.entityToDtoResponse(updatedDayTrip);
    }

    @Override
    public DayTripResponse findOne(String id) {
        return this.dayTripMapper.entityToDtoResponse(this.findById(id));
    }

    @Override
    public List<DayTripResponse> findAll() {
        return this.dayTripRepository.findAll()
                .stream()
                .map(dayTripMapper::entityToDtoResponse)
                .toList();
    }

    @Override
    public Page<DayTripResponse> findAll(int pageNumber, int pageSize) {
        Page<DayTrip> dayTripPage = this.dayTripRepository.findAll(PageRequest.of(pageNumber, pageSize));
        List<DayTripResponse> dayTripResponseList = dayTripPage.getContent()
                .stream()
                .map(dayTripMapper::entityToDtoResponse)
                .toList();

        return new PageImpl<>(dayTripResponseList , dayTripPage.getPageable() , dayTripPage.getTotalElements());
    }


    public Page<DayTrip> filterDayTrips(String title,
                                        String destination,
                                        Date date,
                                        String travelGuideName,
                                        Pageable pageable) {
        Criteria criteria = new Criteria();

        if (title != null && !title.isEmpty()) {
            criteria.and("title").is(title);
        }
        if (destination != null && !destination.isEmpty()) {
            criteria.and("destination").is(destination);
        }
        if (date != null) {
            criteria.and("date").is(date);
        }
        if (travelGuideName != null && !travelGuideName.isEmpty()) {
            Optional<Guide> dayTripByRoleAndUserName = guideRepository.findByUserName(travelGuideName);
            if (dayTripByRoleAndUserName.isPresent()) {
                criteria.and("dayTripGuide").is(dayTripByRoleAndUserName.get());
            } else {
                // No matching user found, return an empty page
                return new PageImpl<>(List.of(), pageable, 0);
            }
        }

        Query query = new Query(criteria).with(pageable);
        List<DayTrip> dayTrips = mongoTemplate.find(query, DayTrip.class);

        // Count total documents matching the criteria (without pagination)
        long count = mongoTemplate.count(query.skip(0).limit(0), DayTrip.class);

        return new PageImpl<>(dayTrips, pageable, count);
    }

    @Override
    public boolean delete(String id) {
        DayTrip dayTrip = this.findById(id);
        if(dayTrip.getImagesUrl() != null)
            this.fileStorageService.deleteFile(dayTrip.getImagesUrl());
        this.dayTripRepository.delete(dayTrip);
        return true;
    }


}
