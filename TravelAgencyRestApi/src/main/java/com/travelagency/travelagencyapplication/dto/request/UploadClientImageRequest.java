package com.travelagency.travelagencyapplication.dto.request;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UploadClientImageRequest {
    private String id;
    private MultipartFile clientImage;
}
