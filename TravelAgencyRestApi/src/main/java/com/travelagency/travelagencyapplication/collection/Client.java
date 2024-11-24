package com.travelagency.travelagencyapplication.collection;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document
public class Client extends User{

    private Passport passport;

    @DBRef
    private Set<Companion> companions;

}
