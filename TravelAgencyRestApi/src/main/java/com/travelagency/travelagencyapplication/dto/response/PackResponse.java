package com.travelagency.travelagencyapplication.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PackResponse {

    private String id;
    private String name;
    private Double additionalPrice;
}
