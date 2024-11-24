package com.travelagency.travelagencyapplication.controller;

import com.travelagency.travelagencyapplication.dto.request.ReservationRequest;
import com.travelagency.travelagencyapplication.dto.response.ReservationResponse;
import com.travelagency.travelagencyapplication.service.IReservationService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/reservations")
public class ReservationController {

    private final IReservationService reservationService;

    public ReservationController(IReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping
    public ReservationResponse create(@RequestBody ReservationRequest reservationRequest){
        return this.reservationService.create(reservationRequest);
    }

    @PostMapping("/clientReservation")
    public ReservationResponse getClientReservation(@RequestBody Map<String, String> request){
        String travelId = request.get("travelId");
        String clientId = request.get("clientId");
        return this.reservationService.getClientReservation(travelId , clientId);
    }

    @PutMapping("/{id}")
    public ReservationResponse update(@PathVariable String id , @RequestBody ReservationRequest reservationRequest){
        return this.reservationService.update(reservationRequest ,id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable String id){
        return new ResponseEntity<>(this.reservationService.delete(id) , HttpStatus.OK);
    }


    @GetMapping("/list")
    public List<ReservationResponse> getReservations(){
        return this.reservationService.findAll();
    }

    @GetMapping("/page")
    public Page<ReservationResponse> getReservations(
            @RequestParam(name = "pageNumber" , defaultValue = "0") int pageNumber ,
            @RequestParam(name = "pageSize" , defaultValue = "5") int pageSize
    ){
        return this.reservationService.findAll(pageNumber , pageSize);
    }

}
