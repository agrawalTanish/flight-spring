package com.flightservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class DuplicateFlightCodeException extends RuntimeException {
    public DuplicateFlightCodeException(String message) {
        super(message);
    }
}
