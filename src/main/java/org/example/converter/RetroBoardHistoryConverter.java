package org.example.converter;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.dto.RetroBoardHistoryDTO;
import org.example.dto.UserDTO;
import org.example.entity.RetroBoardHistory;
import org.example.entity.RetroCard;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RetroBoardHistoryConverter {

    private final RetroCardConverter retroCardConverter;
    private final ObjectMapper objectMapper;

    public RetroBoardHistoryConverter(RetroCardConverter retroCardConverter, ObjectMapper objectMapper) {
        this.retroCardConverter = retroCardConverter;
        this.objectMapper = objectMapper;
    }

    public RetroBoardHistoryDTO toDTO(RetroBoardHistory entity) {
        RetroBoardHistoryDTO dto = new RetroBoardHistoryDTO();
        dto.setId(entity.getId());
        dto.setDeletedAt(entity.getDeletedAt());

        try {
            // 检查 cardsJson 是否为空
            if (entity.getCardsJson() != null && !entity.getCardsJson().isEmpty()) {
                List<RetroCard> cards = objectMapper.readValue(entity.getCardsJson(),
                    objectMapper.getTypeFactory().constructCollectionType(List.class, RetroCard.class));
                dto.setCards(retroCardConverter.toDTOList(cards));
            }

            // 检查 deletedBy 是否为空
            if (entity.getDeletedBy() != null && !entity.getDeletedBy().isEmpty()) {
                UserDTO deletedBy = objectMapper.readValue(entity.getDeletedBy(), UserDTO.class);
                dto.setDeletedBy(deletedBy);
            }
        } catch (Exception e) {
            // 记录异常，但不抛出
            e.printStackTrace();
        }

        return dto;
    }

    public RetroBoardHistory toEntity(RetroBoardHistoryDTO dto) {
        RetroBoardHistory entity = new RetroBoardHistory();
        entity.setId(dto.getId());
        entity.setDeletedAt(dto.getDeletedAt());

        try {
            if (dto.getCards() != null) {
                String cardsJson = objectMapper.writeValueAsString(dto.getCards());
                entity.setCardsJson(cardsJson);
            }

            if (dto.getDeletedBy() != null) {
                String deletedByJson = objectMapper.writeValueAsString(dto.getDeletedBy());
                entity.setDeletedBy(deletedByJson);
            }
        } catch (Exception e) {
            // 记录异常，但不抛出
            e.printStackTrace();
        }

        return entity;
    }
}