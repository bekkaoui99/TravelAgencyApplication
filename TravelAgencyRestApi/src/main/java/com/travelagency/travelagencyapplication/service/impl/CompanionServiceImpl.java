package com.travelagency.travelagencyapplication.service.impl;

import com.travelagency.travelagencyapplication.collection.Client;
import com.travelagency.travelagencyapplication.collection.Companion;
import com.travelagency.travelagencyapplication.dto.request.CompanionRequest;
import com.travelagency.travelagencyapplication.dto.response.CompanionResponse;
import com.travelagency.travelagencyapplication.exception.ResourceAlreadyExistException;
import com.travelagency.travelagencyapplication.exception.ResourceNotFoundException;
import com.travelagency.travelagencyapplication.mapper.IDtoMapper;
import com.travelagency.travelagencyapplication.repository.ClientRepository;
import com.travelagency.travelagencyapplication.repository.CompanionRepository;
import com.travelagency.travelagencyapplication.service.ICompanionService;
import com.travelagency.travelagencyapplication.service.IFileStorageService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
public class CompanionServiceImpl implements ICompanionService {


    private final CompanionRepository companionRepository;
    private final IFileStorageService fileStorageService;
    private final ClientRepository clientRepository;
    private final IDtoMapper<Companion, CompanionRequest, CompanionResponse> companionMapper;


    public CompanionServiceImpl(CompanionRepository companionRepository,
                                IFileStorageService fileStorageService,
                                ClientRepository clientRepository,
                                IDtoMapper<Companion, CompanionRequest,
                                CompanionResponse> companionMapper
    ) {
        this.companionRepository = companionRepository;
        this.fileStorageService = fileStorageService;
        this.clientRepository = clientRepository;
        this.companionMapper = companionMapper;
    }

    private void checkIfCompanionExistWithUserName(String userName){
        Optional<Companion> getCompanionByUserName = this.companionRepository.findByUserName(userName);
        if(getCompanionByUserName.isPresent())
            throw  new ResourceAlreadyExistException("companion already exist with this user name : " + userName);

    }

    private void checkIfCompanionExistWithUserNameAndId(String userName, String id){
        Optional<Companion> getCompanionByUserName = this.companionRepository.findByUserName(userName);
        if(getCompanionByUserName.isPresent() && !getCompanionByUserName.get().getId().equals(id))
            throw  new ResourceAlreadyExistException("companion already exist with this user name : " + userName);

    }


    private void checkIfCompanionExistWithUserCin(String cin){
        Optional<Companion> getCompanionByCin = this.companionRepository.findByCin(cin);
        if (getCompanionByCin.isPresent())
            throw new ResourceAlreadyExistException("companion already exist with this CIN : " + cin);
    }

    private void checkIfCompanionExistWithUserCinAndId(String cin, String id){
        Optional<Companion> getCompanionByCin = this.companionRepository.findByCin(cin);
        if (getCompanionByCin.isPresent() && !getCompanionByCin.get().getId().equals(id))
            throw new ResourceAlreadyExistException("companion already exist with this CIN : " + cin);
    }


    @Override
    public CompanionResponse create(CompanionRequest companionRequest) {

        Client client = this.clientRepository.findById(companionRequest.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("client doesn't exist with this clientId : " + companionRequest.getClientId()));

        Set<Companion> clientCompanions =
                client.getCompanions() != null
                        ? new HashSet<>(client.getCompanions())
                        : new HashSet<>();

        boolean doesCompanionAlreadyExistInClientCompanionList = clientCompanions.stream()
                .anyMatch(comp -> comp.getCin().equals(companionRequest.getCin()));

        if(doesCompanionAlreadyExistInClientCompanionList)
            throw new ResourceAlreadyExistException("this client : " + client.getUserName() + " already added this companion ." );

        String userName = companionRequest.getFirstName() + " " + companionRequest.getLastName();
        checkIfCompanionExistWithUserName(userName);
        checkIfCompanionExistWithUserCin(companionRequest.getCin());

        Companion companion = this.companionMapper.dtoRequestToEntity(companionRequest);
        if(companionRequest.getImageFile() != null){
            String uploadedFile = this.fileStorageService.uploadFile(companionRequest.getImageFile());
            companion.setImageUrl(uploadedFile);
        }
        companion.setClient(client);
        companion.setUserName(userName);
        companion.setId(UUID.randomUUID().toString());
        Companion createdCompanion = this.companionRepository.save(companion);

        // add companion to client companion list
        clientCompanions.add(companion);
        client.setCompanions(clientCompanions);

        this.clientRepository.save(client);


        return this.companionMapper.entityToDtoResponse(createdCompanion);
    }

    @Override
    public CompanionResponse update(CompanionRequest companionRequest, String id) {

        Companion companion = this.companionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("companion doesn't exist with this id : " + id));

        String userName = companionRequest.getFirstName() + " " + companionRequest.getLastName();
        checkIfCompanionExistWithUserNameAndId(userName, companion.getId());
        checkIfCompanionExistWithUserCinAndId(companionRequest.getCin(), companion.getId());

        Companion updatedCompanionFields = this.companionMapper.updateEntityFields(companionRequest, companion);

        if(companionRequest.getImageFile() != null){
            String updatedFile = this.fileStorageService.updateFile(companion.getImageUrl(), companionRequest.getImageFile());
            updatedCompanionFields.setImageUrl(updatedFile);
        }
        updatedCompanionFields.setId(companion.getId());
        Companion createdCompanion = this.companionRepository.save(updatedCompanionFields);

        return this.companionMapper.entityToDtoResponse(createdCompanion);
    }

    @Override
    public CompanionResponse findOne(String id) {
        Companion companion = this.companionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("companion doesn't exist with this id : " + id));

        return this.companionMapper.entityToDtoResponse(companion);
    }

    @Override
    public List<CompanionResponse> findAll() {
        return this.companionRepository.findAll().stream()
                .map(companionMapper::entityToDtoResponse)
                .toList();
    }

    @Override
    public Page<CompanionResponse> findAll(int pageNumber, int pageSize) {
        Page<Companion> companionPage = this.companionRepository.findAll(PageRequest.of(pageNumber, pageSize));
        List<CompanionResponse> companionResponseList = companionPage.getContent()
                .stream()
                .map(companionMapper::entityToDtoResponse)
                .toList();

        return new PageImpl<>(companionResponseList , companionPage.getPageable(), companionPage.getTotalElements());
    }

    @Override
    public boolean delete(String id) {
        Companion companionById = this.companionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("companion doesn't exist with this id : " + id));

        Client client = companionById.getClient();
        Set<Companion> clientCompanions = client.getCompanions() != null
                ? new HashSet<>(client.getCompanions())
                : new HashSet<>();

        clientCompanions.removeIf(companion -> companion.getId().equals(id));
        client.setCompanions(clientCompanions);

        this.clientRepository.save(client);
        this.companionRepository.delete(companionById);
        return true;

    }
}
