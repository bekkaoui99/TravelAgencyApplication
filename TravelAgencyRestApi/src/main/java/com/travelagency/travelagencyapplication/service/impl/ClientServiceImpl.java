package com.travelagency.travelagencyapplication.service.impl;

import com.travelagency.travelagencyapplication.collection.Client;
import com.travelagency.travelagencyapplication.collection.User;
import com.travelagency.travelagencyapplication.dto.request.ClientRequest;
import com.travelagency.travelagencyapplication.dto.response.ClientResponse;
import com.travelagency.travelagencyapplication.exception.ResourceNotFoundException;
import com.travelagency.travelagencyapplication.mapper.IDtoMapper;
import com.travelagency.travelagencyapplication.repository.ClientRepository;
import com.travelagency.travelagencyapplication.repository.CompanionRepository;
import com.travelagency.travelagencyapplication.security.service.IAuthenticationService;
import com.travelagency.travelagencyapplication.service.IClientService;
import com.travelagency.travelagencyapplication.service.IFileStorageService;
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
public class ClientServiceImpl implements IClientService {

    private final ClientRepository clientRepository;
    private final CompanionRepository companionRepository;
    private final IFileStorageService fileStorageService;
    private final IAuthenticationService authenticationService;
    private final IDtoMapper<Client, ClientRequest, ClientResponse> clientMapper;
    private final MongoTemplate mongoTemplate;
    private final PasswordEncoder passwordEncoder;

    public ClientServiceImpl(ClientRepository clientRepository, CompanionRepository companionRepository, IFileStorageService fileStorageService, IAuthenticationService authenticationService,
                             IDtoMapper<Client, ClientRequest, ClientResponse> clientMapper,
                             MongoTemplate mongoTemplate, PasswordEncoder passwordEncoder) {
        this.clientRepository = clientRepository;
        this.companionRepository = companionRepository;
        this.fileStorageService = fileStorageService;
        this.authenticationService = authenticationService;
        this.clientMapper = clientMapper;

        this.mongoTemplate = mongoTemplate;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    public ClientResponse create(ClientRequest clientRequest) {
       return this.authenticationService.clientRegistration(clientRequest);
    }


    @Override
    public Client findClientById(String clientId) {
        return this.clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("client doesn't exist with this Id " + clientId));
    }

    @Override
    public ClientResponse update(ClientRequest clientRequest, String id) {
        Client client = this.clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("client doesn't exist with this Id " + id));

        String password = client.getPassword();
        Client updatedClientFields = this.clientMapper.updateEntityFields(clientRequest, client);
        if(clientRequest.getImageFile() != null) {
            String uploadedFile = this.fileStorageService.updateFile(client.getImageUrl(), clientRequest.getImageFile());
            updatedClientFields.setImageUrl(uploadedFile);
        }
        if(clientRequest.getPassword() != null){
            if(clientRequest.getPassword().equals(clientRequest.getConfirmationPassword())){
                updatedClientFields.setPassword(clientRequest.getPassword());
            }else {
                throw new RuntimeException("Confirmation password doesn't match the password :(");
            }
        }else {
            updatedClientFields.setPassword(passwordEncoder.encode(password));
        }


        Client updatedClient = this.clientRepository.save(updatedClientFields);
        return this.clientMapper.entityToDtoResponse(updatedClient);
    }

    @Override
    public ClientResponse findOne(String id) {
        Client client = this.clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("client doesn't exist with this Id " + id));
        return this.clientMapper.entityToDtoResponse(client);
    }

    @Override
    public List<ClientResponse> findAll() {
        return this.clientRepository.findAll()
                .stream().map(clientMapper::entityToDtoResponse)
                .toList();
    }

    @Override
    public Page<ClientResponse> findAll(int pageNumber, int pageSize) {
        Page<Client> clientPage = this.clientRepository.findAll(PageRequest.of(pageNumber, pageSize));
        List<ClientResponse> clientResponses = clientPage.getContent().stream()
                .map(clientMapper::entityToDtoResponse)
                .toList();
        return new PageImpl<>(clientResponses , clientPage.getPageable() , clientPage.getTotalElements());
    }

    public Page<ClientResponse> filterClients(String firstName,
                                                    String lastName,
                                                    String country,
                                                    String phone,
                                                    Pageable pageable)
    {
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
        List<Client> clients = mongoTemplate.find(query, Client.class);
        List<ClientResponse> clientResponses = this.clientMapper.entitiesToListDtoResponse(clients);
        // Count total documents matching the criteria (without pagination)
        long count = mongoTemplate.count(query.skip(0).limit(0), User.class);
        return new PageImpl<>(clientResponses, pageable, count);
    }


    @Override
    public boolean delete(String id) {
        Client client = this.clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("client doesn't exist with this Id " + id));

        // Delete all companions associated with the client
        if (client.getCompanions() != null && !client.getCompanions().isEmpty()) {
            client.getCompanions().forEach(companion -> {
                companionRepository.deleteById(companion.getId());  // Remove each companion by ID
            });
        }

        this.clientRepository.delete(client);

        if(client.getImageUrl() != null)
            this.fileStorageService.deleteFile(client.getImageUrl());
        return true;
    }

}
