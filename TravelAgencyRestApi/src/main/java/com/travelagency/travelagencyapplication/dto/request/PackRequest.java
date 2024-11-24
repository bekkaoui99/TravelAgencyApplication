package com.travelagency.travelagencyapplication.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PackRequest {
    private String name;
    private Double additionalPrice;
}
