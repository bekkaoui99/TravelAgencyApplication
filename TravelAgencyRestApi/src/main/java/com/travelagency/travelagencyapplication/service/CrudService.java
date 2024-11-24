package com.travelagency.travelagencyapplication.service;

import org.springframework.data.domain.Page;

import java.util.List;

public interface CrudService<REQUEST , RESPONSE , ID> {

    RESPONSE create(REQUEST request);

    RESPONSE update(REQUEST request , ID id);

    RESPONSE findOne(ID id);

    List<RESPONSE> findAll();

    Page<RESPONSE> findAll(int pageNumber , int pageSize);

    boolean delete(ID id);
}
