package com.travelagency.travelagencyapplication.security.service;

import com.travelagency.travelagencyapplication.collection.User;

import java.util.Optional;

public interface IUserService {
    Optional<User> getUserByEmail(String email);
}
