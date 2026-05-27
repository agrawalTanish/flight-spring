package com.flightservice.service.impl;

import com.flightservice.dto.FlightDTO;
import com.flightservice.entity.Flight;
import com.flightservice.exception.DuplicateFlightCodeException;
import com.flightservice.exception.ResourceNotFoundException;
import com.flightservice.repository.FlightRepository;
import com.flightservice.service.FlightService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FlightServiceImpl implements FlightService {

    private final FlightRepository flightRepository;

    @Override
    @Transactional
    public FlightDTO save(FlightDTO flightDTO) {
        if (flightRepository.findByCode(flightDTO.getCode()).isPresent()) {
            throw new DuplicateFlightCodeException("Flight with code " + flightDTO.getCode() + " already exists");
        }
        Flight flight = mapToEntity(flightDTO);
        Flight savedFlight = flightRepository.save(flight);
        return mapToDTO(savedFlight);
    }

    @Override
    @Transactional(readOnly = true)
    public FlightDTO findByCode(String code) {
        Flight flight = flightRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with code: " + code));
        return mapToDTO(flight);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FlightDTO> findByCarrier(String carrier) {
        return flightRepository.findByCarrier(carrier).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FlightDTO> findByRoute(String source, String destination) {
        return flightRepository.findBySourceAndDestination(source, destination).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FlightDTO> findByPriceRange(Double min, Double max) {
        return flightRepository.findByCostBetween(min, max).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FlightDTO> list() {
        return flightRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void delete(String code) {
        Flight flight = flightRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with code: " + code));
        flightRepository.deleteByCode(flight.getCode());
    }

    private Flight mapToEntity(FlightDTO dto) {
        return Flight.builder()
                .id(dto.getId())
                .code(dto.getCode())
                .carrier(dto.getCarrier())
                .source(dto.getSource())
                .destination(dto.getDestination())
                .cost(dto.getCost())
                .build();
    }

    private FlightDTO mapToDTO(Flight entity) {
        return FlightDTO.builder()
                .id(entity.getId())
                .code(entity.getCode())
                .carrier(entity.getCarrier())
                .source(entity.getSource())
                .destination(entity.getDestination())
                .cost(entity.getCost())
                .build();
    }
}
