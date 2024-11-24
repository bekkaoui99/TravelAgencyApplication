package com.travelagency.travelagencyapplication.dto.response;

import lombok.Builder;
import org.springframework.http.HttpStatus;

@Builder
public record ExceptionResponse (
        String message,
        String httpStatus,
        int code
){

}
