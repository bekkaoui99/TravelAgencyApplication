package com.travelagency.travelagencyapplication.controller;


import com.travelagency.travelagencyapplication.dto.request.HotelRequest;
import com.travelagency.travelagencyapplication.dto.request.RegistrationRequest;
import com.travelagency.travelagencyapplication.dto.response.HotelResponse;
import com.travelagency.travelagencyapplication.dto.response.RegistrationResponse;
import com.travelagency.travelagencyapplication.enums.Role;
import com.travelagency.travelagencyapplication.service.IHotelService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.function.EntityResponse;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/hotels")
public class HotelController {


    private final IHotelService hotelService;


    public HotelController(IHotelService hotelService) {
        this.hotelService = hotelService;
    }

    @PostMapping
    public HotelResponse create(@RequestBody HotelRequest hotelRequest){
        return this.hotelService.create(hotelRequest);
    }

    @PostMapping("/clone/{hotelId}")
    public HotelResponse cloneHotelWithId(@PathVariable  String hotelId){
        return this.hotelService.cloneHotel(hotelId);
    }

    @PostMapping("/clone")
    public HotelResponse cloneHotelWithHotelObject(@RequestBody HotelRequest hotelRequest){
        return this.hotelService.create(hotelRequest);
    }

    @PutMapping("/{id}")
    public HotelResponse updateHotel(@PathVariable  String id ,
                                     @RequestBody HotelRequest hotelRequest){
        return this.hotelService.update(hotelRequest , id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteHotel(@PathVariable  String id ){
        return new ResponseEntity<>(this.hotelService.delete(id) , HttpStatus.OK) ;
    }

    @GetMapping("/{id}")
    public HotelResponse getHotelById(@PathVariable  String id){
        return this.hotelService.findOne(id);
    }

    @PostMapping("/byName/list")
    public List<HotelResponse> getHotelsByName(@RequestBody Map<String , String> request){
        String hotelName = request.get("hotelName");
        return this.hotelService.findHotelsByHotelName(hotelName);
    }

    @GetMapping("/byName")
    public HotelResponse getHotelByName(@RequestParam String hotelName){
        return this.hotelService.findHotelByHotelName(hotelName);
    }

    @GetMapping("/list")
    public List<HotelResponse> getHotels(){
        return this.hotelService.findAll();
    }

    @GetMapping("/page")
    public Page<HotelResponse> getHotels(
            @RequestParam(name = "pageNumber" , defaultValue = "0") int pageNumber ,
            @RequestParam(name = "pageSize" , defaultValue = "5") int pageSize){
        return this.hotelService.findAll(pageNumber , pageSize);
    }




}
