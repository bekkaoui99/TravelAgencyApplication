package com.travelagency.travelagencyapplication.service.impl;

import com.travelagency.travelagencyapplication.exception.ResourceNotFoundException;
import com.travelagency.travelagencyapplication.mapper.IDtoMapper;
import com.travelagency.travelagencyapplication.service.CrudService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;


public abstract class CrudServiceImpl<ENTITY , REQUEST , RESPONSE , ID> implements CrudService<REQUEST , RESPONSE , ID> {

    private final MongoRepository<ENTITY , ID> repository;
    private final IDtoMapper<ENTITY , REQUEST , RESPONSE> mapper;
    private final String resource;

    public CrudServiceImpl(MongoRepository<ENTITY, ID> repository, IDtoMapper<ENTITY, REQUEST, RESPONSE> mapper, String resource) {
        this.repository = repository;
        this.mapper = mapper;
        this.resource = resource;
    }

    @Override
    public RESPONSE create(REQUEST request) {

        ENTITY entity = mapper.dtoRequestToEntity(request);
        ENTITY created = this.repository.save(entity);
        return this.mapper.entityToDtoResponse(created);

    }

    @Override
    public RESPONSE update(REQUEST request, ID id) {

        ENTITY entity = this.repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(resource + "doesn't exist with this ID : " + id));

        ENTITY updatedEntity = this.mapper.updateEntityFields(request ,entity);

        ENTITY saved = this.repository.save(updatedEntity);
        return this.mapper.entityToDtoResponse(saved);

    }

    @Override
    public RESPONSE findOne(ID id) {
        ENTITY entity = this.repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(resource + "doesn't exist with this ID : " + id));

        return this.mapper.entityToDtoResponse(entity);
    }

    @Override
    public List<RESPONSE> findAll() {
        return this.repository.findAll()
                .stream()
                .map(mapper::entityToDtoResponse)
                .toList();
    }

    @Override
    public Page<RESPONSE> findAll(int pageNumber, int pageSize) {
        Page<ENTITY> page = this.repository.findAll(PageRequest.of(pageNumber, pageSize));
        List<RESPONSE> responseList = page.getContent()
                .stream()
                .map(mapper::entityToDtoResponse)
                .toList();

        return new PageImpl<>(responseList , page.getPageable() , page.getTotalElements());
    }

    @Override
    public boolean delete(ID id) {
        ENTITY entity = this.repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(resource + "doesn't exist with this ID : " + id));

        this.repository.delete(entity);
        return true;
    }

}
