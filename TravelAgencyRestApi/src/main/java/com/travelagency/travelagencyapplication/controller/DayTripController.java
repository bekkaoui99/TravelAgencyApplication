package com.travelagency.travelagencyapplication.controller;


import com.travelagency.travelagencyapplication.dto.request.ActivityRequest;
import com.travelagency.travelagencyapplication.dto.request.DayTripRequest;
import com.travelagency.travelagencyapplication.dto.response.ActivityResponse;
import com.travelagency.travelagencyapplication.dto.response.DayTripResponse;
import com.travelagency.travelagencyapplication.service.IDayTripService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/dayTrips")
public class DayTripController {

    private final IDayTripService dayTripService;

    public DayTripController(IDayTripService dayTripService) {
        this.dayTripService = dayTripService;
    }


    @PostMapping
    public DayTripResponse create(@RequestBody DayTripRequest dayTripRequest){
        return this.dayTripService.createDayTrip(dayTripRequest);
    }

    @PostMapping("/clone/{dayTripId}")
    public DayTripResponse cloneDayTripWithId(@PathVariable String dayTripId){
        return this.dayTripService.cloneDayTrip(dayTripId);
    }

    @PostMapping("/clone")
    public DayTripResponse cloneDayTripWithDayTripObject(@RequestBody DayTripRequest dayTripRequest){
        return this.dayTripService.cloneDayTrip(dayTripRequest);
    }

    @PostMapping("/uploadDayTripImages")
    public DayTripResponse uploadDayTripImages(@RequestParam String dayTripId , @RequestParam Set<MultipartFile> dayTripImages){
        return this.dayTripService.uploadDayTripImages(dayTripId , dayTripImages);
    }

    @PutMapping("/{id}")
    public DayTripResponse update(@PathVariable String id , @RequestBody  DayTripRequest dayTripRequest){
        return this.dayTripService.update(dayTripRequest ,id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable String id){
        return new ResponseEntity<>(this.dayTripService.delete(id) , HttpStatus.OK);
    }

    @GetMapping("/byId/{id}")
    public DayTripResponse getDaysTripById(@PathVariable String id){
        return this.dayTripService.findOne(id);
    }

    @GetMapping("/list")
    public List<DayTripResponse> getDaysTrip(){
        return this.dayTripService.findAll();
    }

    @GetMapping("/page")
    public Page<DayTripResponse> getDaysTrip(
            @RequestParam(name = "pageNumber" , defaultValue = "0") int pageNumber ,
            @RequestParam(name = "pageSize" , defaultValue = "5") int pageSize
    ){
        return this.dayTripService.findAll(pageNumber , pageSize);
    }



}
