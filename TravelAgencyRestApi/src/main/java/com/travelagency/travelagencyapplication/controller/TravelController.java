package com.travelagency.travelagencyapplication.controller;


import com.travelagency.travelagencyapplication.collection.Travel;
import com.travelagency.travelagencyapplication.dto.request.TravelRequest;
import com.travelagency.travelagencyapplication.dto.response.DayTripResponse;
import com.travelagency.travelagencyapplication.dto.response.TravelResponse;
import com.travelagency.travelagencyapplication.service.ITravelService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Set;


@RestController
@RequestMapping("/api/v1/travels")
public class TravelController {


    private final ITravelService travelService;

    public TravelController(ITravelService travelService) {
        this.travelService = travelService;
    }

    @PostMapping
    public TravelResponse create(@RequestBody TravelRequest travelRequest){
        return this.travelService.create(travelRequest);
    }

    @PostMapping("/canceledReservation")
    public TravelResponse canceledReservation(@RequestBody Map<String , String> canceledReservationRequest){
        String travelId = canceledReservationRequest.get("travelId");
        String clientId = canceledReservationRequest.get("clientId");
        return this.travelService.canceledReservation(travelId , clientId);
    }

    @PutMapping("/{id}")
    public TravelResponse update(@PathVariable String id , @RequestBody TravelRequest travelRequest){
        return this.travelService.update(travelRequest ,id);
    }

    @PostMapping("/uploadTravelImages")
    public TravelResponse uploadTravelImages(@RequestParam String travelId , @RequestParam Set<MultipartFile> travelImages){
        return this.travelService.uploadTravelImages(travelId , travelImages);
    }

    @PostMapping("/clone/{travelId}")
    public TravelResponse cloneTravelWithTravelId(@PathVariable String travelId){
        return this.travelService.cloneTravel(travelId);
    }

    @PostMapping("/clone")
    public TravelResponse cloneTravelWithTravelObject(@RequestBody TravelRequest travelRequest){
        return this.travelService.cloneTravel(travelRequest);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable String id){
        return new ResponseEntity<>(this.travelService.delete(id) , HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public TravelResponse getTravel(@PathVariable String id){
        return this.travelService.findOne(id);
    }


    @GetMapping("/list")
    public List<TravelResponse> getTravels(){
        return this.travelService.findAll();
    }

    @GetMapping("/page")
    public Page<TravelResponse> getTravels(
            @RequestParam(name = "pageNumber" , defaultValue = "0") int pageNumber ,
            @RequestParam(name = "pageSize" , defaultValue = "5") int pageSize
    ){
        return this.travelService.findAll(pageNumber , pageSize);
    }


}
