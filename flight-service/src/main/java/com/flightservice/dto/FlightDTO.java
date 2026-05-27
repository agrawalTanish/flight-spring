package com.flightservice.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightDTO {

    private Long id;

    @NotBlank(message = "Flight code is required")
    @Pattern(regexp = "^[A-Z]{2}-\\d{3,4}$", message = "Flight code must be in the format XX-123 or XX-1234 (e.g., AI-101 or AA-1234)")
    private String code;

    @NotBlank(message = "Carrier is required")
    private String carrier;

    @NotBlank(message = "Source is required")
    private String source;

    @NotBlank(message = "Destination is required")
    private String destination;

    @NotNull(message = "Cost is required")
    @DecimalMin(value = "0.01", message = "Cost must be greater than zero")
    private Double cost;
}
