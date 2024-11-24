package com.travelagency.travelagencyapplication.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthenticationResponse{

    private String userName;
    private String accessToken;
    private String refreshToken;
}
