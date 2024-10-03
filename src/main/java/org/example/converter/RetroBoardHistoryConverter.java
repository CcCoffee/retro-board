package org.example.converter;

import org.example.dto.RetroBoardHistoryDTO;
import org.example.dto.RetroCardDTO;
import org.example.entity.RetroBoardHistory;
import org.example.util.JsonUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RetroBoardHistoryConverter {

    @Autowired
    private JsonUtil jsonUtil;

    public RetroBoardHistoryDTO toDTO(RetroBoardHistory entity) {
        if (entity == null) {
            return null;
        }
        List<RetroCardDTO> cards = jsonUtil.parseCardsJson(entity.getCardsJson());
        return new RetroBoardHistoryDTO(
                entity.getId(),
                cards,
                entity.getDeletedByUserId(),
                entity.getDeletedByUsername(),
                entity.getDeletedAt()
        );
    }

    public RetroBoardHistory toEntity(RetroBoardHistoryDTO dto) {
        if (dto == null) {
            return null;
        }
        RetroBoardHistory entity = new RetroBoardHistory();
        entity.setId(dto.getId());
        entity.setCardsJson(jsonUtil.convertCardsToJson(dto.getCards()));
        entity.setDeletedByUserId(dto.getDeletedByUserId());
        entity.setDeletedByUsername(dto.getDeletedByUsername());
        entity.setDeletedAt(dto.getDeletedAt());
        return entity;
    }
}