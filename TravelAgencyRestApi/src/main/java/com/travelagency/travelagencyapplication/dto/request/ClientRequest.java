
package com.travelagency.travelagencyapplication.dto.request;

import com.travelagency.travelagencyapplication.collection.Passport;
import com.travelagency.travelagencyapplication.dto.response.TravelResponse;
import com.travelagency.travelagencyapplication.dto.response.UserResponse;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientRequest extends UserRequest {
    private Passport passport;
}
