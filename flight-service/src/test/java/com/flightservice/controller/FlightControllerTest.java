package com.flightservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flightservice.dto.FlightDTO;
import com.flightservice.exception.ResourceNotFoundException;
import com.flightservice.service.FlightService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(FlightController.class)
public class FlightControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FlightService flightService;

    @Autowired
    private ObjectMapper objectMapper;

    private FlightDTO flightDTO;

    @BeforeEach
    public void setUp() {
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
    public void testSaveSuccess() throws Exception {
        when(flightService.save(any(FlightDTO.class))).thenReturn(flightDTO);

        mockMvc.perform(post("/api/flights")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(flightDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value("AA-101"))
                .andExpect(jsonPath("$.carrier").value("American Airlines"));
    }

    @Test
    public void testSaveValidationFailure() throws Exception {
        FlightDTO invalidDTO = FlightDTO.builder()
                .code("AA-10")
                .carrier("")
                .source("Nagpur")
                .destination("Pune")
                .cost(-10.0)
                .build();

        mockMvc.perform(post("/api/flights")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Validation Failed"));
    }

    @Test
    public void testList() throws Exception {
        when(flightService.list()).thenReturn(Collections.singletonList(flightDTO));

        mockMvc.perform(get("/api/flights"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].code").value("AA-101"));
    }

    @Test
    public void testFindByCodeSuccess() throws Exception {
        when(flightService.findByCode("AA-101")).thenReturn(flightDTO);

        mockMvc.perform(get("/api/flights/code/AA-101"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("AA-101"));
    }

    @Test
    public void testFindByCodeNotFound() throws Exception {
        when(flightService.findByCode("AA-101")).thenThrow(new ResourceNotFoundException("Flight not found with code: AA-101"));

        mockMvc.perform(get("/api/flights/code/AA-101"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Flight not found with code: AA-101"));
    }

    @Test
    public void testFindByCarrier() throws Exception {
        when(flightService.findByCarrier("American Airlines")).thenReturn(Collections.singletonList(flightDTO));

        mockMvc.perform(get("/api/flights/carrier/American Airlines"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].carrier").value("American Airlines"));
    }

    @Test
    public void testFindByRoute() throws Exception {
        when(flightService.findByRoute("Nagpur", "Pune")).thenReturn(Collections.singletonList(flightDTO));

        mockMvc.perform(get("/api/flights/route")
                        .param("source", "Nagpur")
                        .param("destination", "Pune"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].code").value("AA-101"));
    }

    @Test
    public void testFindByPriceRange() throws Exception {
        when(flightService.findByPriceRange(2000.0, 3000.0)).thenReturn(Collections.singletonList(flightDTO));

        mockMvc.perform(get("/api/flights/price")
                        .param("min", "2000")
                        .param("max", "3000"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].cost").value(2500.0));
    }

    @Test
    public void testDeleteSuccess() throws Exception {
        doNothing().when(flightService).delete("AA-101");

        mockMvc.perform(delete("/api/flights/AA-101"))
                .andExpect(status().isNoContent());
    }

    @Test
    public void testDeleteNotFound() throws Exception {
        doThrow(new ResourceNotFoundException("Flight not found with code: AA-101")).when(flightService).delete("AA-101");

        mockMvc.perform(delete("/api/flights/AA-101"))
                .andExpect(status().isNotFound());
    }
}
