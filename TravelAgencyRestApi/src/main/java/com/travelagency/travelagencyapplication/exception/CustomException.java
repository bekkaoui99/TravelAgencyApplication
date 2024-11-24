package com.travelagency.travelagencyapplication.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

 @Getter
public class CustomException extends RuntimeException{

    private final HttpStatus httpStatus;
    private final int code;
    public CustomException(String message , HttpStatus httpStatus , int code){
        super(message);
        this.httpStatus = httpStatus;
        this.code = code;
    }
}
