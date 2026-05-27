package com.flightservice.service.impl;

import com.flightservice.dto.FlightDTO;
import com.flightservice.entity.Flight;
import com.flightservice.exception.DuplicateFlightCodeException;
import com.flightservice.exception.ResourceNotFoundException;
import com.flightservice.repository.FlightRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class FlightServiceImplTest {

    @Mock
    private FlightRepository flightRepository;

    @InjectMocks
    private FlightServiceImpl flightService;

    private Flight flight;
    private FlightDTO flightDTO;

    @BeforeEach
    public void setUp() {
        flight = Flight.builder()
                .id(1L)
                .code("AA-101")
                .carrier("American Airlines")
                .source("Nagpur")
                .destination("Pune")
                .cost(2500.0)
                .build();

        flightDTO = FlightDTO.builder()
                .id(1L)
                .code("AA-101")
                .carrier("American Airlines")
                .source("Nagpur")
                .destination("Pune")
                .cost(2500.0)
                .build();
    }

    @Test
    public void testSaveSuccess() {
        when(flightRepository.findByCode(flightDTO.getCode())).thenReturn(Optional.empty());
        when(flightRepository.save(any(Flight.class))).thenReturn(flight);

        FlightDTO saved = flightService.save(flightDTO);

        assertThat(saved).isNotNull();
        assertThat(saved.getCode()).isEqualTo(flightDTO.getCode());
        verify(flightRepository, times(1)).save(any(Flight.class));
    }

    @Test
    public void testSaveDuplicateCodeThrowsException() {
        when(flightRepository.findByCode(flightDTO.getCode())).thenReturn(Optional.of(flight));

        assertThatThrownBy(() -> flightService.save(flightDTO))
                .isInstanceOf(DuplicateFlightCodeException.class)
                .hasMessageContaining("already exists");

        verify(flightRepository, times(0)).save(any(Flight.class));
    }

    @Test
    public void testFindByCodeSuccess() {
        when(flightRepository.findByCode("AA-101")).thenReturn(Optional.of(flight));

        FlightDTO found = flightService.findByCode("AA-101");

        assertThat(found).isNotNull();
        assertThat(found.getCode()).isEqualTo("AA-101");
    }

    @Test
    public void testFindByCodeNotFoundThrowsException() {
        when(flightRepository.findByCode("AA-101")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> flightService.findByCode("AA-101"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("not found");
    }

    @Test
    public void testFindByCarrier() {
        when(flightRepository.findByCarrier("American Airlines")).thenReturn(Collections.singletonList(flight));

        List<FlightDTO> result = flightService.findByCarrier("American Airlines");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCarrier()).isEqualTo("American Airlines");
    }

    @Test
    public void testFindByRoute() {
        when(flightRepository.findBySourceAndDestination("Nagpur", "Pune")).thenReturn(Collections.singletonList(flight));

        List<FlightDTO> result = flightService.findByRoute("Nagpur", "Pune");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCode()).isEqualTo("AA-101");
    }

    @Test
    public void testFindByPriceRange() {
        when(flightRepository.findByCostBetween(2000.0, 3000.0)).thenReturn(Collections.singletonList(flight));

        List<FlightDTO> result = flightService.findByPriceRange(2000.0, 3000.0);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCost()).isEqualTo(2500.0);
    }

    @Test
    public void testList() {
        when(flightRepository.findAll()).thenReturn(Collections.singletonList(flight));

        List<FlightDTO> result = flightService.list();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCode()).isEqualTo("AA-101");
    }

    @Test
    public void testDeleteSuccess() {
        when(flightRepository.findByCode("AA-101")).thenReturn(Optional.of(flight));

        flightService.delete("AA-101");

        verify(flightRepository, times(1)).deleteByCode("AA-101");
    }

    @Test
    public void testDeleteNotFoundThrowsException() {
        when(flightRepository.findByCode("AA-101")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> flightService.delete("AA-101"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("not found");

        verify(flightRepository, times(0)).deleteByCode(any(String.class));
    }
}
