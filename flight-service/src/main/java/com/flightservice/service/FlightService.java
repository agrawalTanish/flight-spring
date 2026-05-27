package com.flightservice.service;

import com.flightservice.dto.FlightDTO;

import java.util.List;

public interface FlightService {

    FlightDTO save(FlightDTO flightDTO);

    FlightDTO findByCode(String code);

    List<FlightDTO> findByCarrier(String carrier);

    List<FlightDTO> findByRoute(String source, String destination);

    List<FlightDTO> findByPriceRange(Double min, Double max);

    List<FlightDTO> list();

    void delete(String code);
}
