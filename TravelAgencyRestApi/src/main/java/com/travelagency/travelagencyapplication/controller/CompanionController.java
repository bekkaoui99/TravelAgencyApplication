package com.travelagency.travelagencyapplication.controller;

import com.travelagency.travelagencyapplication.dto.request.CompanionRequest;
import com.travelagency.travelagencyapplication.dto.response.CompanionResponse;
import com.travelagency.travelagencyapplication.service.ICompanionService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/v1/companions")
public class CompanionController {

    private final ICompanionService companionService;

    public CompanionController(ICompanionService companionService) {
        this.companionService = companionService;
    }

    @PostMapping
    public CompanionResponse createCompanion(@ModelAttribute CompanionRequest companionRequest) {
        return companionService.create(companionRequest);
    }

    @PutMapping("/{id}")
    public CompanionResponse updateCompanion(@PathVariable String id, @ModelAttribute CompanionRequest companionRequest) {
        return companionService.update(companionRequest, id);
    }

    @GetMapping("/{id}")
    public CompanionResponse getCompanionById(@PathVariable String id) {
        return companionService.findOne(id);
    }

    @GetMapping("/list")
    public List<CompanionResponse> getAllCompanions() {
        return companionService.findAll();
    }

    @GetMapping("/page")
    public Page<CompanionResponse> getAllCompanions(@RequestParam(value = "page", defaultValue = "0") int page,
                                                    @RequestParam(value = "size", defaultValue = "10") int size) {
        return companionService.findAll(page, size);
    }

    @DeleteMapping("/{id}")
    public boolean deleteCompanion(@PathVariable String id) {
        return  companionService.delete(id);
    }

}
