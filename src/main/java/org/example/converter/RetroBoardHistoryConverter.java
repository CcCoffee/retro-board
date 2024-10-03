package org.example.converter;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.dto.RetroBoardHistoryDTO;
import org.example.dto.RetroCardDTO;
import org.example.dto.UserDTO;
import org.example.entity.RetroBoardHistory;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RetroBoardHistoryConverter {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RetroCardConverter retroCardConverter;

    public RetroBoardHistoryConverter(RetroCardConverter retroCardConverter) {
        this.retroCardConverter = retroCardConverter;
    }

    public RetroBoardHistoryDTO toDTO(RetroBoardHistory entity) {
        RetroBoardHistoryDTO dto = new RetroBoardHistoryDTO();
        dto.setId(entity.getId());
        dto.setDeletedAt(entity.getDeletedAt());

        try {
            List<RetroCardDTO> cards = objectMapper.readValue(entity.getCardsJson(), 
                objectMapper.getTypeFactory().constructCollectionType(List.class, RetroCardDTO.class));
            dto.setCards(cards);

            UserDTO deletedBy = objectMapper.readValue(entity.getDeletedBy(), UserDTO.class);
            dto.setDeletedBy(deletedBy);
        } catch (Exception e) {
            // 处理异常
        }

        return dto;
    }

    public RetroBoardHistory toEntity(RetroBoardHistoryDTO dto) {
        RetroBoardHistory entity = new RetroBoardHistory();
        entity.setId(dto.getId());
        entity.setDeletedAt(dto.getDeletedAt());

        try {
            String cardsJson = objectMapper.writeValueAsString(dto.getCards());
            entity.setCardsJson(cardsJson);

            String deletedByJson = objectMapper.writeValueAsString(dto.getDeletedBy());
            entity.setDeletedBy(deletedByJson);
        } catch (Exception e) {
            // 处理异常
        }

        return entity;
    }
}