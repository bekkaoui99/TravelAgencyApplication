package com.travelagency.travelagencyapplication.mapper;

import java.util.List;
import java.util.stream.Collectors;

public interface IDtoMapper<ENTITY , DTO_REQUEST , DTO_RESPONSE> {

     ENTITY dtoRequestToEntity(DTO_REQUEST dtoRequest);

     DTO_RESPONSE entityToDtoResponse(ENTITY entity);

     ENTITY updateEntityFields(DTO_REQUEST dtoRequest , ENTITY entity);

    default List<DTO_RESPONSE> entitiesToListDtoResponse(List<ENTITY> entities){
        return  entities.stream()
                .map(this::entityToDtoResponse)
                .collect(Collectors.toList());
    };

    default List<ENTITY> toEntities(List<DTO_REQUEST> dtoRequestList){
        return  dtoRequestList.stream()
                .map(this::dtoRequestToEntity)
                .collect(Collectors.toList());
    };
}
