package com.travelagency.travelagencyapplication.collection;

import com.travelagency.travelagencyapplication.enums.Role;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Set;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document
public abstract class User {

    @Id
    private String id;
    private String firstName;
    private String lastName;
    private String userName;
    private String country;
    private String phone;
    private String cin;
    private String email;
    private String password;
    private String imageUrl;
    private Role role;

}
