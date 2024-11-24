
package com.travelagency.travelagencyapplication.dto.response;

import com.travelagency.travelagencyapplication.collection.Passport;
import com.travelagency.travelagencyapplication.enums.Role;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientResponse extends UserResponse{
    private Passport passport;
    private List<TravelResponse> clientTravels;
}
