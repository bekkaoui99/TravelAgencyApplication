package com.travelagency.travelagencyapplication.dto.request;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistrationRequest{

    private String firstName;
    private String lastName;
    private String country;
    private String phone;
    private String cin;
    private String email;
    private String password;
    private String confirmationPassword;
    private MultipartFile imageFile;

}
