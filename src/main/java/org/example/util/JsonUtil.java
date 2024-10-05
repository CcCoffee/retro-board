package org.example.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.dto.RetroCardDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class JsonUtil {

    @Autowired
    private ObjectMapper objectMapper;

    public List<RetroCardDTO> parseCardsJson(String cardsJson) {
        try {
            return objectMapper.readValue(cardsJson, new TypeReference<List<RetroCardDTO>>() {});
        } catch (JsonProcessingException e) {
            // Log the error and return an empty list
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public String convertObjectToJson(Object object) {
        try {
            return objectMapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            // Log the error and return an empty JSON array
            e.printStackTrace();
            return "[]";
        }
    }
}
