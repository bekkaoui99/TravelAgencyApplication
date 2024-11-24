package com.travelagency.travelagencyapplication.collection;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@NoArgsConstructor
@Builder
@Document
public class Admin extends User{
}
