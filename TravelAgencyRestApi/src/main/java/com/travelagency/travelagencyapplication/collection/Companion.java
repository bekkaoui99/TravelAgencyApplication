package com.travelagency.travelagencyapplication.collection;

import com.travelagency.travelagencyapplication.enums.CompanionType;
import com.travelagency.travelagencyapplication.enums.Role;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document
public class Companion{

    @Id
    private String id;
    private CompanionType companionType;

    private String firstName;
    private String lastName;
    private String userName;
    private String country;
    private String phone;
    private String cin;
    private String imageUrl;

    private Passport passport;


    @DBRef
    private Client client;

}
