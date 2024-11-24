package com.travelagency.travelagencyapplication.security.service;

import com.travelagency.travelagencyapplication.collection.Client;
import com.travelagency.travelagencyapplication.collection.User;
import com.travelagency.travelagencyapplication.dto.request.AuthenticationRequest;
import com.travelagency.travelagencyapplication.dto.request.ClientRequest;
import com.travelagency.travelagencyapplication.dto.request.RegistrationRequest;
import com.travelagency.travelagencyapplication.dto.request.UserRequest;
import com.travelagency.travelagencyapplication.dto.response.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;


public interface IAuthenticationService {

    ClientResponse clientRegistration(ClientRequest clientRegistrationRequest );
    GuideResponse guideRegistration(UserRequest guideRegistrationRequest);
    UserResponse adminRegistration(UserRequest adminRegistrationRequest);
    Optional<User> getUserByEmail(String email);
    AuthenticationResponse login(AuthenticationRequest authenticationRequest);
    AuthenticationResponse refreshToken(HttpServletRequest request) throws Exception;
    User getAuthenticatedUser();

}
