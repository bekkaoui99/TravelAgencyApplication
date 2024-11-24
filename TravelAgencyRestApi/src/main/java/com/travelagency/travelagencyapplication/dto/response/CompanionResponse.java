package com.travelagency.travelagencyapplication.dto.response;

import com.travelagency.travelagencyapplication.collection.Passport;
import com.travelagency.travelagencyapplication.dto.request.UserRequest;
import com.travelagency.travelagencyapplication.enums.CompanionType;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanionResponse {

    private String id;
    private CompanionType companionType;

    private String firstName;
    private String lastName;
    private String userName;
    private String country;
    private String phone;
    private String cin;
    private String imageUrl;

    private Passport passport;

    private ClientResponse client;
}
