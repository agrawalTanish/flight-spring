package com.flightservice.controller;

import com.flightservice.dto.FlightDTO;
import com.flightservice.service.FlightService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Flight Controller", description = "Management APIs for Flights")
public class FlightController {

    private final FlightService flightService;

    @PostMapping
    @Operation(summary = "Save a new flight", description = "Adds a unique flight schedule to the system database")
    @ApiResponse(responseCode = "201", description = "Flight saved successfully")
    @ApiResponse(responseCode = "400", description = "Invalid validation parameters or duplicate code")
    public ResponseEntity<FlightDTO> save(@Valid @RequestBody FlightDTO flightDTO) {
        FlightDTO savedFlight = flightService.save(flightDTO);
        return new ResponseEntity<>(savedFlight, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all flights", description = "Lists all existing flights stored in the system database")
    @ApiResponse(responseCode = "200", description = "Fetched list of all flights")
    public ResponseEntity<List<FlightDTO>> list() {
        List<FlightDTO> flights = flightService.list();
        return ResponseEntity.ok(flights);
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "Find flight by code", description = "Retrieves details of a specific flight using its code")
    @ApiResponse(responseCode = "200", description = "Flight details loaded successfully")
    @ApiResponse(responseCode = "404", description = "Flight code does not exist")
    public ResponseEntity<FlightDTO> findByCode(@PathVariable String code) {
        FlightDTO flight = flightService.findByCode(code);
        return ResponseEntity.ok(flight);
    }

    @GetMapping("/carrier/{carrier}")
    @Operation(summary = "Find flights by carrier", description = "Retrieves all flights belonging to a particular airline carrier")
    @ApiResponse(responseCode = "200", description = "Fetched list of flights by carrier")
    public ResponseEntity<List<FlightDTO>> findByCarrier(@PathVariable String carrier) {
        List<FlightDTO> flights = flightService.findByCarrier(carrier);
        return ResponseEntity.ok(flights);
    }

    @GetMapping("/route")
    @Operation(summary = "Find flights by route", description = "Retrieves all flights traveling from a source destination to a target destination")
    @ApiResponse(responseCode = "200", description = "Fetched list of flights by route")
    public ResponseEntity<List<FlightDTO>> findByRoute(@RequestParam String source, @RequestParam String destination) {
        List<FlightDTO> flights = flightService.findByRoute(source, destination);
        return ResponseEntity.ok(flights);
    }

    @GetMapping("/price")
    @Operation(summary = "Find flights within a price range", description = "Retrieves all flights whose cost is between the minimum and maximum threshold")
    @ApiResponse(responseCode = "200", description = "Fetched list of flights within the price window")
    public ResponseEntity<List<FlightDTO>> findByPriceRange(@RequestParam Double min, @RequestParam Double max) {
        List<FlightDTO> flights = flightService.findByPriceRange(min, max);
        return ResponseEntity.ok(flights);
    }

    @DeleteMapping("/{code}")
    @Operation(summary = "Delete flight by code", description = "Removes a flight entry from the database system")
    @ApiResponse(responseCode = "204", description = "Flight deleted successfully")
    @ApiResponse(responseCode = "404", description = "Flight code does not exist")
    public ResponseEntity<Void> delete(@PathVariable String code) {
        flightService.delete(code);
        return ResponseEntity.noContent().build();
    }
}
