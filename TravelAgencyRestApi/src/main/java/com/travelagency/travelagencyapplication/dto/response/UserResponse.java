package com.travelagency.travelagencyapplication.dto.response;

import com.travelagency.travelagencyapplication.enums.Role;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String firstName;
    private String lastName;
    private String country;
    private String phone;
    private String cin;
    private String userName;
    private String email;
    private String imageUrl;
    private Role role;
}
