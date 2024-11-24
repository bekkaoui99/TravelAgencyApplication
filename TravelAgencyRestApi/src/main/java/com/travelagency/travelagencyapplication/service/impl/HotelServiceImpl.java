package com.travelagency.travelagencyapplication.service.impl;

import com.travelagency.travelagencyapplication.collection.Hotel;
import com.travelagency.travelagencyapplication.dto.request.HotelRequest;
import com.travelagency.travelagencyapplication.dto.response.HotelResponse;
import com.travelagency.travelagencyapplication.exception.ResourceNotFoundException;
import com.travelagency.travelagencyapplication.mapper.IDtoMapper;
import com.travelagency.travelagencyapplication.repository.HotelRepository;
import com.travelagency.travelagencyapplication.service.IHotelService;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class HotelServiceImpl extends CrudServiceImpl<Hotel , HotelRequest , HotelResponse , String> implements IHotelService {

    private final HotelRepository hotelRepository;
    private final IDtoMapper<Hotel, HotelRequest, HotelResponse> hotelMapper;

    public HotelServiceImpl(
            HotelRepository hotelRepository,
            IDtoMapper<Hotel, HotelRequest, HotelResponse> hotelMapper
    ) {
        super(hotelRepository, hotelMapper, "hotel");
        this.hotelRepository = hotelRepository;
        this.hotelMapper = hotelMapper;
    }


    @Override
    public List<HotelResponse> findHotelsByHotelName(String hotelName) {
        return this.hotelRepository.findByNameContains(hotelName)
                .stream()
                .map(hotelMapper::entityToDtoResponse)
                .toList();
    }

    @Override
    public HotelResponse findHotelByHotelName(String hotelName) {
        Hotel hotel = this.hotelRepository.findByName(hotelName)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel doesn't exist with this Name : " + hotelName));

        return this.hotelMapper.entityToDtoResponse(hotel);
    }

    @Override
    public HotelResponse cloneHotel(String hotelId) {
        Hotel hotel = this.hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel doesn't exist with this Id : " + hotelId));

        hotel.setId(UUID.randomUUID().toString());
        hotel.setName(hotel.getName() + " #copy");
        Hotel clonedHotel = this.hotelRepository.save(hotel);
        return this.hotelMapper.entityToDtoResponse(clonedHotel);
    }

    @Override
    public HotelResponse cloneHotel(HotelRequest hotelRequest) {
        Hotel hotel = this.hotelMapper.dtoRequestToEntity(hotelRequest);
        Hotel clonedHotel = this.hotelRepository.save(hotel);
        return this.hotelMapper.entityToDtoResponse(clonedHotel);
    }
}
