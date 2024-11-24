package com.travelagency.travelagencyapplication.controller;


import com.travelagency.travelagencyapplication.dto.request.RegistrationRequest;
import com.travelagency.travelagencyapplication.dto.request.UserRequest;
import com.travelagency.travelagencyapplication.dto.response.GuideResponse;
import com.travelagency.travelagencyapplication.dto.response.RegistrationResponse;
import com.travelagency.travelagencyapplication.security.service.IAuthenticationService;
import com.travelagency.travelagencyapplication.service.IGuideService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/guides")
public class GuideController {

    private final IGuideService guideService;
    private final IAuthenticationService authenticationService;

    public GuideController(IGuideService guideService, IAuthenticationService authenticationService) {
        this.guideService = guideService;
        this.authenticationService = authenticationService;
    }


    @PostMapping
    public GuideResponse create(@ModelAttribute UserRequest guideRegistrationRequest){
        return this.authenticationService.guideRegistration(guideRegistrationRequest);
    }


    @GetMapping("/list")
    public List<GuideResponse> getGuides(){
        return this.guideService.findAll();
    }

    @GetMapping("/page")
    public Page<GuideResponse> getGuides(
            @RequestParam(name = "pageNumber" , defaultValue = "0") int pageNumber ,
            @RequestParam(name = "pageSize" , defaultValue = "5") int pageSize){
        return this.guideService.findAll(pageNumber , pageSize);
    }

    @PutMapping("/{id}")
    public GuideResponse updateGuide(@PathVariable  String id ,
                                     @ModelAttribute UserRequest userRequest){
        return this.guideService.update(userRequest , id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteGuide(@PathVariable  String id){
        return new ResponseEntity<>(this.guideService.delete(id) , HttpStatus.OK) ;
    }

}
