package com.travelagency.travelagencyapplication.mapper;


import org.modelmapper.ModelMapper;

public class DtoMapperImpl<ENTITY , DTO_REQUEST , DTO_RESPONSE> implements IDtoMapper<ENTITY , DTO_REQUEST , DTO_RESPONSE>{

    private final ModelMapper modelMapper;
    private final Class<ENTITY> entityClass;
    private final Class<DTO_RESPONSE> dtoResponseClass;

    protected DtoMapperImpl(ModelMapper modelMapper,
                            Class<ENTITY> entityClass,
                            Class<DTO_RESPONSE> dtoResponseClass) {
        this.modelMapper = modelMapper;
        this.entityClass = entityClass;
        this.dtoResponseClass = dtoResponseClass;
    }


    @Override
    public ENTITY dtoRequestToEntity(DTO_REQUEST dtoRequest) {
        return this.modelMapper.map(dtoRequest , this.entityClass);
    }

    @Override
    public DTO_RESPONSE entityToDtoResponse(ENTITY entity) {
        return this.modelMapper.map(entity , this.dtoResponseClass);
    }

    @Override
    public ENTITY updateEntityFields(DTO_REQUEST dtoRequest , ENTITY entity ) {
         this.modelMapper.map(dtoRequest , entity);
         return entity;
    }


}
