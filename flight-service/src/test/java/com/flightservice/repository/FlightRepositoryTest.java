package com.flightservice.repository;

import com.flightservice.entity.Flight;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class FlightRepositoryTest {

    @Autowired
    private FlightRepository flightRepository;

    private Flight flight1;
    private Flight flight2;

    @BeforeEach
    public void setUp() {
        flightRepository.deleteAll();

        flight1 = Flight.builder()
                .code("AA-101")
                .carrier("American Airlines")
                .source("Nagpur")
                .destination("Pune")
                .cost(2500.0)
                .build();

        flight2 = Flight.builder()
                .code("AI-202")
                .carrier("Air India")
                .source("Mumbai")
                .destination("Delhi")
                .cost(4500.0)
                .build();

        flightRepository.save(flight1);
        flightRepository.save(flight2);
    }

    @Test
    public void testFindByCode() {
        Optional<Flight> found = flightRepository.findByCode("AA-101");
        assertThat(found).isPresent();
        assertThat(found.get().getCarrier()).isEqualTo("American Airlines");
    }

    @Test
    public void testFindByCarrier() {
        List<Flight> flights = flightRepository.findByCarrier("Air India");
        assertThat(flights).hasSize(1);
        assertThat(flights.get(0).getCode()).isEqualTo("AI-202");
    }

    @Test
    public void testFindBySourceAndDestination() {
        List<Flight> flights = flightRepository.findBySourceAndDestination("Nagpur", "Pune");
        assertThat(flights).hasSize(1);
        assertThat(flights.get(0).getCode()).isEqualTo("AA-101");
    }

    @Test
    public void testFindByCostBetween() {
        List<Flight> flights = flightRepository.findByCostBetween(2000.0, 3000.0);
        assertThat(flights).hasSize(1);
        assertThat(flights.get(0).getCode()).isEqualTo("AA-101");
    }

    @Test
    public void testDeleteByCode() {
        flightRepository.deleteByCode("AA-101");
        Optional<Flight> found = flightRepository.findByCode("AA-101");
        assertThat(found).isNotPresent();
    }
}
