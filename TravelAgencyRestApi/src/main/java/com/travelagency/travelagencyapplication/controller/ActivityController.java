package com.travelagency.travelagencyapplication.controller;


import com.travelagency.travelagencyapplication.dto.request.ActivityRequest;
import com.travelagency.travelagencyapplication.dto.response.ActivityResponse;
import com.travelagency.travelagencyapplication.service.IActivityService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/activities")
public class ActivityController {

    private final IActivityService activityService;

    public ActivityController(IActivityService iActivityService) {
        this.activityService = iActivityService;
    }

    @PostMapping
    public ActivityResponse create(@ModelAttribute ActivityRequest activityRequest){
        return this.activityService.create(activityRequest);
    }

    @PostMapping("/clone/{activityId}")
    public ActivityResponse cloneActivityWithId(@PathVariable String activityId){
        return this.activityService.cloneActivity(activityId);
    }

    @PostMapping("/clone")
    public ActivityResponse cloneActivityWithActivityObject(@ModelAttribute ActivityRequest activityRequest){
        return this.activityService.cloneActivity(activityRequest);
    }

    @PutMapping("/{id}")
    public ActivityResponse update(@ModelAttribute ActivityRequest activityRequest, @PathVariable String id){
        return this.activityService.update(activityRequest ,id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable String id){
        return new ResponseEntity<>(this.activityService.delete(id) , HttpStatus.OK);
    }

    @GetMapping("/byId/{id}")
    public ActivityResponse getActivityById(@PathVariable String id){
        return this.activityService.findOne(id);
    }

    @GetMapping("/{activityName}")
    public ActivityResponse getActivity(@PathVariable String activityName){
        return this.activityService.getActivityByName(activityName);
    }

    @GetMapping("/list")
    public List<ActivityResponse> getActivities(){
        return this.activityService.findAll();
    }

    @GetMapping("/page")
    public Page<ActivityResponse> getActivities(
            @RequestParam(name = "pageNumber" , defaultValue = "0") int pageNumber ,
            @RequestParam(name = "pageSize" , defaultValue = "5") int pageSize
    ){
        return this.activityService.findAll(pageNumber , pageSize);
    }

    @GetMapping("/count")
    public Long getActivityNumber(){
        return this.activityService.getActivityNumber();
    }

}
