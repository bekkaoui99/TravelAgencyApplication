package com.travelagency.travelagencyapplication.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistrationResponse{
    private String id;
    private String firstName;
    private String lastName;
    private String phone;
    private String username;
    private String email;
    private String imageUrl;

}
