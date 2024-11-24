package com.travelagency.travelagencyapplication.security.Controller;


import com.travelagency.travelagencyapplication.dto.request.AuthenticationRequest;
import com.travelagency.travelagencyapplication.dto.request.ClientRequest;
import com.travelagency.travelagencyapplication.dto.request.RegistrationRequest;
import com.travelagency.travelagencyapplication.dto.request.UserRequest;
import com.travelagency.travelagencyapplication.dto.response.*;
import com.travelagency.travelagencyapplication.enums.Role;
import com.travelagency.travelagencyapplication.security.service.AuthenticationServiceImpl;
import com.travelagency.travelagencyapplication.security.service.IAuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {


    private final IAuthenticationService authenticationService;


    @PostMapping("/login")
    public AuthenticationResponse authentication(@RequestBody AuthenticationRequest authenticationRequest){
       return authenticationService.login(authenticationRequest);
    }

    @PostMapping("/clientRegistration")
    public ResponseEntity<ClientResponse> clientRegistration(@ModelAttribute ClientRequest clientRequest){
        ClientResponse response = authenticationService.clientRegistration(clientRequest);
        return new ResponseEntity<>(response , HttpStatus.CREATED);
    }

    @PostMapping("/guideRegistration")
    public ResponseEntity<GuideResponse> tourGuideRegistration(@ModelAttribute UserRequest registrationRequest){
        GuideResponse response = authenticationService.guideRegistration(registrationRequest);
        return new ResponseEntity<>(response , HttpStatus.CREATED);
    }


    @PostMapping("/refreshToken")
    public AuthenticationResponse refreshToken(
            HttpServletRequest request
    )throws Exception{
        return authenticationService.refreshToken(request);
    }

}
