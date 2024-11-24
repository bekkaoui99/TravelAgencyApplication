package com.travelagency.travelagencyapplication.dto.response;

import com.travelagency.travelagencyapplication.collection.Travel;
import com.travelagency.travelagencyapplication.enums.Role;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GuideResponse extends UserResponse{
    private List<TravelResponse> guideTravels;
}
