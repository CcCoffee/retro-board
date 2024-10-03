package org.example.converter;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.dto.LikeUser;
import org.example.dto.RetroCardDTO;
import org.example.entity.RetroCard;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RetroCardConverter {

    @Autowired
    private ObjectMapper objectMapper;

    public RetroCardDTO toDTO(RetroCard retroCard) {
        RetroCardDTO dto = new RetroCardDTO();
        dto.setId(retroCard.getId());
        dto.setType(retroCard.getType());
        dto.setContent(retroCard.getContent());
        dto.setAnonymous(retroCard.isAnonymous());
        dto.setAuthorId(retroCard.getAuthorId());
        dto.setAuthorName(retroCard.getAuthorName());
        dto.setCreatedAt(retroCard.getCreatedAt());

        try {
            List<LikeUser> likes = objectMapper.readValue(retroCard.getLikesJson(), new TypeReference<List<LikeUser>>() {});
            dto.setLikes(likes);
        } catch (Exception e) {
            throw new RuntimeException("Error parsing likes JSON", e);
        }

        return dto;
    }

    public RetroCard toEntity(RetroCardDTO dto) {
        RetroCard entity = new RetroCard();
        entity.setId(dto.getId());
        entity.setType(dto.getType());
        entity.setContent(dto.getContent());
        entity.setAnonymous(dto.isAnonymous());
        entity.setAuthorId(dto.getAuthorId());
        entity.setAuthorName(dto.getAuthorName());
        entity.setCreatedAt(dto.getCreatedAt());

        try {
            String likesJson = objectMapper.writeValueAsString(dto.getLikes());
            entity.setLikesJson(likesJson);
        } catch (Exception e) {
            throw new RuntimeException("Error converting likes to JSON", e);
        }

        return entity;
    }

}