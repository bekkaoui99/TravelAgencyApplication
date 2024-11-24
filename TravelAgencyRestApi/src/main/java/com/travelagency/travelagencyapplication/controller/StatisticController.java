package com.travelagency.travelagencyapplication.controller;

import com.travelagency.travelagencyapplication.dto.response.StatisticsResponse;
import com.travelagency.travelagencyapplication.service.StatisticService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/statistics")
public class StatisticController {


    private final StatisticService statisticService;

    public StatisticController(StatisticService statisticService) {
        this.statisticService = statisticService;
    }

    @GetMapping
    public StatisticsResponse getStatistics() {
        return statisticService.getAllStatistics();
    }

}
