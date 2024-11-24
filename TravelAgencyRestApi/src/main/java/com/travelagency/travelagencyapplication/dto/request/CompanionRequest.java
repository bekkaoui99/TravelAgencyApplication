package com.travelagency.travelagencyapplication.dto.request;

import com.travelagency.travelagencyapplication.collection.Client;
import com.travelagency.travelagencyapplication.collection.Passport;
import com.travelagency.travelagencyapplication.dto.response.ClientResponse;
import com.travelagency.travelagencyapplication.enums.CompanionType;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanionRequest {

    private CompanionType companionType;

    private String firstName;
    private String lastName;
    private String userName;
    private String country;
    private String phone;
    private String cin;
    private MultipartFile imageFile;

    private Passport passport;

    private String clientId;
}
