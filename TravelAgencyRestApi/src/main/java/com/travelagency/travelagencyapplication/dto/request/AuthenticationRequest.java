package com.travelagency.travelagencyapplication.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthenticationRequest{

    private String email;
    private String password;

}
