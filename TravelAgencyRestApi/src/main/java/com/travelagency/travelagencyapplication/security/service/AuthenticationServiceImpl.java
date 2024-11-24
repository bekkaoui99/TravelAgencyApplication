package com.travelagency.travelagencyapplication.security.service;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelagency.travelagencyapplication.collection.Admin;
import com.travelagency.travelagencyapplication.collection.Client;
import com.travelagency.travelagencyapplication.collection.Guide;
import com.travelagency.travelagencyapplication.collection.User;
import com.travelagency.travelagencyapplication.dto.request.AuthenticationRequest;
import com.travelagency.travelagencyapplication.dto.request.ClientRequest;
import com.travelagency.travelagencyapplication.dto.request.UserRequest;
import com.travelagency.travelagencyapplication.dto.response.*;
import com.travelagency.travelagencyapplication.enums.Role;
import com.travelagency.travelagencyapplication.exception.ResourceAlreadyExistException;
import com.travelagency.travelagencyapplication.exception.ResourceNotFoundException;
import com.travelagency.travelagencyapplication.mapper.ClientMapper;
import com.travelagency.travelagencyapplication.mapper.GuideMapper;
import com.travelagency.travelagencyapplication.mapper.UserMapper;
import com.travelagency.travelagencyapplication.repository.AdminRepository;
import com.travelagency.travelagencyapplication.repository.ClientRepository;
import com.travelagency.travelagencyapplication.repository.GuideRepository;
import com.travelagency.travelagencyapplication.security.model.SecurityUser;
import com.travelagency.travelagencyapplication.service.IFileStorageService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements IAuthenticationService {


    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final ClientRepository clientRepository;
    private final GuideRepository guideRepository;
    private final AdminRepository adminRepository;
    private final IUserService userService;
    private final JwtService jwtService;
    private final ClientMapper clientMapper;
    private final GuideMapper guideMapper;
    private final UserMapper userMapper;
    private final IFileStorageService fileStorageService;



    private void RegistrationChecks(UserRequest registrationRequest) {
        boolean existsByCin = adminRepository.existsByCin(registrationRequest.getCin()) ||
                clientRepository.existsByCin(registrationRequest.getCin()) ||
                guideRepository.existsByCin(registrationRequest.getCin());

        if (existsByCin) {
            throw new ResourceAlreadyExistException("User already exists with Cin: " + registrationRequest.getCin());
        }

        boolean existsByEmail = adminRepository.findByEmail(registrationRequest.getEmail()).isPresent() ||
                clientRepository.findByEmail(registrationRequest.getEmail()).isPresent() ||
                guideRepository.findByEmail(registrationRequest.getEmail()).isPresent();

        if (existsByEmail) {
            throw new ResourceAlreadyExistException("User already exists with Email: " + registrationRequest.getEmail());
        }

        if (!registrationRequest.getPassword().equals(registrationRequest.getConfirmationPassword())) {
            throw new IllegalArgumentException("Confirmation password doesn't match the password :(");
        }
    }




//    @Transactional
//    public RegistrationResponse singUp(RegistrationRequest registerRequest , Role role) {
//
//       // check(registerRequest);
//
//        String uploadedFile = null;
//        if (registerRequest.getImageFile() != null){
//             uploadedFile = this.fileStorageService.uploadFile(registerRequest.getImageFile());
//        }
//
//        User user = new User();
//        user.setId(UUID.randomUUID().toString());
//        user.setCin(registerRequest.getCin());
//        user.setFirstName(registerRequest.getFirstName());
//        user.setLastName(registerRequest.getLastName());
//        user.setUserName(registerRequest.getFirstName() + " " + registerRequest.getLastName());
//        user.setEmail(registerRequest.getEmail());
//        user.setPhone(registerRequest.getPhone());
//        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
//        user.setImageUrl(uploadedFile);
//
//        if (role == Role.TOUR_GUIDE) {
//          user.setRole(Role.TOUR_GUIDE);
//        }
//        else if (role == Role.ADMIN ) {
//            user.setRole(Role.ADMIN);
//        }
//        else {
//            user.setRole(Role.CLIENT);
//        }
//        User createdUser = userRepository.save(user);
//
//        return this.userMapper.entityToDtoResponse(createdUser);
//    }


    @Override
    public  ClientResponse clientRegistration(ClientRequest clientRegistrationRequest) {

        RegistrationChecks(clientRegistrationRequest);
        String uploadedFile = null;
        if (clientRegistrationRequest.getImageFile() != null){
            uploadedFile = this.fileStorageService.uploadFile(clientRegistrationRequest.getImageFile());
        }
        Client client = this.clientMapper.dtoRequestToEntity(clientRegistrationRequest);
        client.setUserName(clientRegistrationRequest.getFirstName() + " " + clientRegistrationRequest.getLastName());
        client.setImageUrl(uploadedFile);
        client.setPassword(passwordEncoder.encode(clientRegistrationRequest.getPassword()));
        client.setRole(Role.CLIENT);

        Client createdClient = this.clientRepository.save(client);


        return this.clientMapper.entityToDtoResponse(createdClient);

    }
//
//    @Override
//    public  ClientResponse clientRegistration(ClientRequest clientRegistrationRequest ,MultipartFile imageFile ) {
//
//        check(clientRegistrationRequest);
//        String uploadedFile = null;
//        if (imageFile != null){
//            uploadedFile = this.fileStorageService.uploadFile(imageFile);
//        }
//        Client client = this.clientMapper.dtoRequestToEntity(clientRegistrationRequest);
//        client.setUserName(clientRegistrationRequest.getFirstName() + " " + clientRegistrationRequest.getLastName());
//        client.setImageUrl(uploadedFile);
//        client.setPassword(passwordEncoder.encode(clientRegistrationRequest.getPassword()));
//        client.setRole(Role.CLIENT);
//
//        Client createdClient = this.clientRepository.save(client);
//        return this.clientMapper.entityToDtoResponse(createdClient);
//
//    }
//
//
//
//    @Override
//    public Client createClientForReservation(ClientRequest clientRegistrationRequest) {
//
//        check(clientRegistrationRequest);
//        String uploadedFile = null;
//        if (clientRegistrationRequest.getImageFile() != null){
//            uploadedFile = this.fileStorageService.uploadFile(clientRegistrationRequest.getImageFile());
//        }
//        Client client = this.clientMapper.dtoRequestToEntity(clientRegistrationRequest);
//        client.setUserName(clientRegistrationRequest.getFirstName() + " " + clientRegistrationRequest.getLastName());
//        client.setImageUrl(uploadedFile);
//        client.setPassword(passwordEncoder.encode(clientRegistrationRequest.getPassword()));
//        client.setRole(Role.CLIENT);
//
//        return this.clientRepository.save(client);
//    }

    @Override
    public GuideResponse guideRegistration(UserRequest guideRegistrationRequest) {

        RegistrationChecks(guideRegistrationRequest);
        String uploadedFile = null;
        if (guideRegistrationRequest.getImageFile() != null){
            uploadedFile = this.fileStorageService.uploadFile(guideRegistrationRequest.getImageFile());
        }
        Guide guide = this.guideMapper.dtoRequestToEntity(guideRegistrationRequest);

        guide.setUserName(guide.getFirstName().toLowerCase() + " " + guide.getLastName().toLowerCase());
        guide.setImageUrl(uploadedFile);
        guide.setPassword(passwordEncoder.encode(guideRegistrationRequest.getPassword()));
        guide.setRole(Role.TOUR_GUIDE);

        Guide createdGuide = this.guideRepository.save(guide);
        return this.guideMapper.entityToDtoResponse(createdGuide);
    }

    @Override
    public UserResponse adminRegistration(UserRequest adminRegistrationRequest){

        RegistrationChecks(adminRegistrationRequest);
        String uploadedFile = null;
        if (adminRegistrationRequest.getImageFile() != null){
            uploadedFile = this.fileStorageService.uploadFile(adminRegistrationRequest.getImageFile());
        }
        Admin admin = new Admin();
        admin.setFirstName(adminRegistrationRequest.getFirstName());
        admin.setLastName(adminRegistrationRequest.getLastName());
        if(adminRegistrationRequest.getUserName() != null){
            admin.setUserName(adminRegistrationRequest.getUserName());
        }
        admin.setEmail(adminRegistrationRequest.getEmail());
        admin.setUserName(adminRegistrationRequest.getFirstName() + " " + adminRegistrationRequest.getLastName());
        admin.setImageUrl(uploadedFile);
        admin.setPassword(passwordEncoder.encode(adminRegistrationRequest.getPassword()));
        admin.setRole(Role.ADMIN);
        admin.setPhone(adminRegistrationRequest.getPhone());
        admin.setCin(adminRegistrationRequest.getCin());

        Admin createdAdmin = this.adminRepository.save(admin);
        return this.userMapper.entityToDtoResponse(createdAdmin);
    }

    @Override
    public Optional<User> getUserByEmail(String email) {

        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) {
            return Optional.of(admin.get());
        }

        Optional<Client> client = clientRepository.findByEmail(email);
        if (client.isPresent()) {
            return Optional.of(client.get());
        }

        Optional<Guide> guide = guideRepository.findByEmail(email);
        if (guide.isPresent()) {
            return Optional.of(guide.get());
        }

        return Optional.empty();
    }


    public AuthenticationResponse login(AuthenticationRequest authenticationRequest) {

        User user = getUserByEmail(authenticationRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));

        if(!passwordEncoder.matches(authenticationRequest.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authenticationRequest.getEmail(), authenticationRequest.getPassword())
        );

        Map<String, Object> claims = new HashMap<>();
        String roles = authenticate.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));

        claims.put("role", roles);

        SecurityUser securityUser = new SecurityUser(user);
        String accessToken = jwtService.generateToken(claims, securityUser);
        String refreshToken = jwtService.generateRefreshToken(securityUser);

        return AuthenticationResponse.builder()
                .userName(user.getUserName())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }



    public AuthenticationResponse refreshToken(HttpServletRequest request) throws Exception {
        final String authHeader = request.getHeader("Authorization");
        final String refreshToken;
        final String username;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new Exception("Invalid authorization header");
        }
        refreshToken = authHeader.substring(7);
        username = jwtService.extractUsername(refreshToken);

        if (username != null) {
            var user = getUserByEmail(username).map(SecurityUser::new)
                    .orElseThrow(() -> new ResourceNotFoundException("User doesn't exist ."));

            if (jwtService.isTokenValid(refreshToken, user)) {
                Map<String, Object> claims = new HashMap<>();
                String roles = user.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.joining(" "));

                claims.put("role", roles);
                String newAccessToken = jwtService.generateToken(claims, user);

                return AuthenticationResponse.builder()
                        .userName(user.getUsername())
                        .accessToken(newAccessToken)
                        .refreshToken(refreshToken)
                        .build();
            } else {
                throw new Exception("Invalid refresh token");
            }
        } else {
            throw new Exception("Username not found in token");
        }
    }


    @Override
    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User userByEmail = null;
        if(authentication != null && authentication.isAuthenticated()){
            String email = authentication.getName();
            System.out.println("SecurityContextHolder : " + email);
            userByEmail = userService.getUserByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("user not found with this email : " + email));
        }
        return userByEmail;
    }



}
