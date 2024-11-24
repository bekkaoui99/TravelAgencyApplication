package com.travelagency.travelagencyapplication.init;

import com.travelagency.travelagencyapplication.collection.Client;
import com.travelagency.travelagencyapplication.collection.Guide;
import com.travelagency.travelagencyapplication.collection.Passport;
import com.travelagency.travelagencyapplication.dto.request.RegistrationRequest;
import com.travelagency.travelagencyapplication.dto.request.UserRequest;
import com.travelagency.travelagencyapplication.enums.Role;
import com.travelagency.travelagencyapplication.repository.AdminRepository;
import com.travelagency.travelagencyapplication.repository.ClientRepository;
import com.travelagency.travelagencyapplication.repository.GuideRepository;
import com.travelagency.travelagencyapplication.security.service.IAuthenticationService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.time.LocalDate;


@Configuration
public class InitDataToDB {

    @Bean
    public CommandLineRunner commandLineRunner(
            AdminRepository adminRepository,
            IAuthenticationService authenticationService

    ){
        return args -> {

            System.out.println("exist : " + adminRepository.existsByEmail("admin@gmail.com"));
            if(!adminRepository.existsByEmail("admin@gmail.com")){
                System.out.println("create an admin .");
                UserRequest admin = new UserRequest();

                admin.setFirstName("admin");
                admin.setLastName("admin");
                admin.setUserName("admin_admin");
                admin.setEmail("admin@gmail.com");
                admin.setPassword("password");
                admin.setConfirmationPassword("password");


                authenticationService.adminRegistration(admin);
            }


        };

    }


}
