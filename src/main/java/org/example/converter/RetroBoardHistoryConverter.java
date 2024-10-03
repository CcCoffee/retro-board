package org.example.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.example.dto.RetroBoardHistoryDTO;
import org.example.entity.RetroBoardHistory;
import org.example.entity.RetroCard;

import java.util.ArrayList;
import java.util.List;

public class RetroBoardHistoryConverter {
    private static final ObjectMapper objectMapper = new ObjectMapper()
        .registerModule(new JavaTimeModule());

    public static RetroBoardHistoryDTO toDTO(RetroBoardHistory entity) {
        if (entity == null) {
            return null;
        }

        List<RetroCard> cards = parseCardsJson(entity.getCardsJson());

        return new RetroBoardHistoryDTO(
                entity.getId(),
                cards,
                entity.getDeletedBy(),
                entity.getDeletedAt()
        );
    }

    public static RetroBoardHistory toEntity(RetroBoardHistoryDTO dto) {
        if (dto == null) {
            return null;
        }

        RetroBoardHistory entity = new RetroBoardHistory();
        entity.setId(dto.getId());
        entity.setCardsJson(convertCardsToJson(dto.getCards()));
        entity.setDeletedBy(dto.getDeletedBy());
        entity.setDeletedAt(dto.getDeletedAt());

        return entity;
    }

    private static List<RetroCard> parseCardsJson(String cardsJson) {
        try {
            return objectMapper.readValue(cardsJson, new TypeReference<List<RetroCard>>() {});
        } catch (JsonProcessingException e) {
            // Log the error and return an empty list
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    private static String convertCardsToJson(List<RetroCard> cards) {
        try {
            return objectMapper.writeValueAsString(cards);
        } catch (JsonProcessingException e) {
            // Log the error and return an empty JSON array
            e.printStackTrace();
            return "[]";
        }
    }
}