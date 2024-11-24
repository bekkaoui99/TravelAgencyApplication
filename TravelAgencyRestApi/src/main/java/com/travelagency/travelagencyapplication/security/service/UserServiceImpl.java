package com.travelagency.travelagencyapplication.security.service;

import com.travelagency.travelagencyapplication.collection.Admin;
import com.travelagency.travelagencyapplication.collection.Client;
import com.travelagency.travelagencyapplication.collection.Guide;
import com.travelagency.travelagencyapplication.collection.User;
import com.travelagency.travelagencyapplication.repository.AdminRepository;
import com.travelagency.travelagencyapplication.repository.ClientRepository;
import com.travelagency.travelagencyapplication.repository.GuideRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService{


    private final ClientRepository clientRepository;
    private final GuideRepository guideRepository;
    private final AdminRepository adminRepository;

    @Override
    public Optional<User> getUserByEmail(String email) {
        Optional<Client> candidate = clientRepository.findByEmail(email);
        if (candidate.isPresent()) {
            return Optional.of(candidate.get());
        }

        Optional<Guide> recruiter = guideRepository.findByEmail(email);
        if (recruiter.isPresent()) {
            return Optional.of(recruiter.get());
        }

        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) {
            return Optional.of(admin.get());
        }

        return Optional.empty();
    }
}
