
package com.issueflow;

import java.util.LinkedHashMap;
import java.util.Map;

import jakarta.validation.ConstraintViolationException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger =
            LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // 1. Request body validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(
            MethodArgumentNotValidException ex) {

        Map<String, Object> response = new LinkedHashMap<>();
        Map<String, String> messages = new LinkedHashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error ->
                messages.put(
                        error.getField(),
                        error.getDefaultMessage()
                )
        );

        response.put("status", 400);
        response.put("error", "Bad Request");
        response.put("messages", messages);

        return ResponseEntity.badRequest().body(response);
    }

    // 2. Database/entity validation errors
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, Object>> handleConstraintViolation(
            ConstraintViolationException ex) {

        Map<String, Object> response = new LinkedHashMap<>();
        Map<String, String> messages = new LinkedHashMap<>();

        ex.getConstraintViolations().forEach(violation ->
                messages.put(
                        violation.getPropertyPath().toString(),
                        violation.getMessage()
                )
        );

        response.put("status", 400);
        response.put("error", "Bad Request");
        response.put("messages", messages);

        return ResponseEntity.badRequest().body(response);
    }

    // 3. Missing database resource
    @ExceptionHandler(EmptyResultDataAccessException.class)
    public ResponseEntity<Map<String, Object>> handleEmptyResult(
            EmptyResultDataAccessException ex) {

        return buildError(
                HttpStatus.NOT_FOUND,
                "Resource Not Found",
                "The requested resource was not found."
        );
    }

    // 4. Missing static resource
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNoResource(
            NoResourceFoundException ex) {

        return buildError(
                HttpStatus.NOT_FOUND,
                "Not Found",
                "The requested endpoint was not found."
        );
    }

    // 5. Unexpected errors
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralErrors(
            Exception ex) {

        // Print actual exception in the application terminal
        logger.error("Unexpected error occurred", ex);

        return buildError(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Internal Server Error",
                "Something went wrong. Please try again."
        );
    }

    // Common JSON error response
    private ResponseEntity<Map<String, Object>> buildError(
            HttpStatus status,
            String error,
            String message) {

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("status", status.value());
        response.put("error", error);
        response.put("message", message);

        return ResponseEntity.status(status).body(response);
    }
}
