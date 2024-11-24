package com.travelagency.travelagencyapplication.service.impl;


import com.travelagency.travelagencyapplication.collection.Guide;
import com.travelagency.travelagencyapplication.collection.User;
import com.travelagency.travelagencyapplication.dto.request.UserRequest;
import com.travelagency.travelagencyapplication.dto.response.GuideResponse;
import com.travelagency.travelagencyapplication.exception.ResourceNotFoundException;
import com.travelagency.travelagencyapplication.mapper.IDtoMapper;
import com.travelagency.travelagencyapplication.repository.GuideRepository;
import com.travelagency.travelagencyapplication.service.IFileStorageService;
import com.travelagency.travelagencyapplication.service.IGuideService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GuideServiceImpl implements IGuideService {

    private final GuideRepository guideRepository;
    private final PasswordEncoder passwordEncoder;
    private final IFileStorageService fileStorageService;
    private final IDtoMapper<Guide, UserRequest, GuideResponse> guideMapper;
    private final MongoTemplate mongoTemplate;

    public GuideServiceImpl(GuideRepository guideRepository, PasswordEncoder passwordEncoder, IFileStorageService fileStorageService, IDtoMapper<Guide, UserRequest, GuideResponse> guideMapper, MongoTemplate mongoTemplate) {
        this.guideRepository = guideRepository;
        this.passwordEncoder = passwordEncoder;
        this.fileStorageService = fileStorageService;
        this.guideMapper = guideMapper;
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public GuideResponse create(UserRequest userRequest) {
        Guide guide = this.guideMapper.dtoRequestToEntity(userRequest);
        guide.setUserName(userRequest.getFirstName() + " " + userRequest.getLastName());
        guide.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        if(userRequest.getImageFile() != null) {
            String uploadedFile = this.fileStorageService.uploadFile(userRequest.getImageFile());
            guide.setImageUrl(uploadedFile);
        }
        Guide createdGuide = this.guideRepository.save(guide);
        return this.guideMapper.entityToDtoResponse(createdGuide);
    }

    @Override
    public GuideResponse update(UserRequest userRequest, String id) {
        Guide guide = this.guideRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("guide doesn't exist with this Id : " + id));
        String password = guide.getPassword();
        Guide updatedGuideFields = this.guideMapper.updateEntityFields(userRequest, guide);
        if(userRequest.getImageFile() != null) {
            String uploadedFile = this.fileStorageService.updateFile(guide.getImageUrl(), userRequest.getImageFile());
            updatedGuideFields.setImageUrl(uploadedFile);
        }
        if(userRequest.getPassword() != null){
            if(userRequest.getPassword().equals(userRequest.getConfirmationPassword())){
                updatedGuideFields.setPassword(userRequest.getPassword());
            }else {
                throw new RuntimeException("Confirmation password doesn't match the password :(");
            }
        }else {
            updatedGuideFields.setPassword(passwordEncoder.encode(password));
        }

        Guide updatedGuide = this.guideRepository.save(updatedGuideFields);
        return this.guideMapper.entityToDtoResponse(updatedGuide);
    }

    @Override
    public GuideResponse findOne(String id) {
        Guide guide = this.guideRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("guide doesn't exist with this Id : " + id));
        return this.guideMapper.entityToDtoResponse(guide);
    }

    @Override
    public List<GuideResponse> findAll() {
        return this.guideRepository.findAll()
                .stream().map(guideMapper::entityToDtoResponse)
                .toList();
    }

    @Override
    public Page<GuideResponse> findAll(int pageNumber, int pageSize) {
        Page<Guide> guidePage = this.guideRepository.findAll(PageRequest.of(pageNumber, pageSize));
        List<GuideResponse> guideResponseList = guidePage.getContent().stream()
                .map(guideMapper::entityToDtoResponse)
                .toList();
        return new PageImpl<>(guideResponseList , guidePage.getPageable() , guidePage.getTotalElements());
    }

    @Override
    public boolean delete(String id) {
        Guide guide = this.guideRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("guide doesn't exist with this Id " + id));
        this.guideRepository.delete(guide);

        if(guide.getImageUrl() != null)
            this.fileStorageService.deleteFile(guide.getImageUrl());
        return true;
    }

    @Override
    public Page<GuideResponse> filterClients(String firstName, String lastName, String country, String phone, Pageable pageable) {
        Criteria criteria = new Criteria();

        if (firstName != null && !firstName.isEmpty()) {
            criteria.and("firstName").is(firstName);
        }
        if (lastName != null && !lastName.isEmpty()) {
            criteria.and("lastName").is(lastName);
        }
        if (country != null && !country.isEmpty()) {
            criteria.and("country").is(country);
        }
        if (phone != null && !phone.isEmpty()) {
            criteria.and("phone").is(phone);
        }

        Query query = new Query(criteria).with(pageable);
        List<Guide> guides = mongoTemplate.find(query, Guide.class);
        List<GuideResponse> guideResponses = this.guideMapper.entitiesToListDtoResponse(guides);
        // Count total documents matching the criteria (without pagination)
        long count = mongoTemplate.count(query.skip(0).limit(0), User.class);
        return new PageImpl<>(guideResponses, pageable, count);

    }
}
