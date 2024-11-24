package com.travelagency.travelagencyapplication.security.service;


import com.travelagency.travelagencyapplication.collection.Admin;
import com.travelagency.travelagencyapplication.collection.Client;
import com.travelagency.travelagencyapplication.collection.Guide;
import com.travelagency.travelagencyapplication.dto.response.ClientResponse;
import com.travelagency.travelagencyapplication.dto.response.GuideResponse;
import com.travelagency.travelagencyapplication.repository.AdminRepository;
import com.travelagency.travelagencyapplication.repository.ClientRepository;
import com.travelagency.travelagencyapplication.repository.GuideRepository;
import com.travelagency.travelagencyapplication.security.model.SecurityUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {


    private final ClientRepository clientRepository;
    private final GuideRepository guideRepository;
    private final AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Optional<Client> client = this.clientRepository.findByEmail(username);
        if(client.isPresent()){
            return client.map(SecurityUser::new).get();
        }
        Optional<Admin> admin = this.adminRepository.findByEmail(username);
        if(admin.isPresent()){
            return admin.map(SecurityUser::new).get();
        }
        Optional<Guide> guide = this.guideRepository.findByEmail(username);
        if(guide.isPresent()){
            return guide.map(SecurityUser::new).get();
        } else {
            throw new UsernameNotFoundException("User " + username + " not found");
        }

    }

}
