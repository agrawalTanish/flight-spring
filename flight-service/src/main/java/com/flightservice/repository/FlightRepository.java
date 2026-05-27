package com.flightservice.repository;

import com.flightservice.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface FlightRepository extends JpaRepository<Flight, Long> {

    Optional<Flight> findByCode(String code);

    List<Flight> findByCarrier(String carrier);

    List<Flight> findBySourceAndDestination(String source, String destination);

    List<Flight> findByCostBetween(Double min, Double max);

    @Modifying
    @Transactional
    void deleteByCode(String code);
}
