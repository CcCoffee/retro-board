package org.example.converter;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.dto.ActionItemDTO;
import org.example.dto.UserDTO;
import org.example.entity.ActionItem;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ActionItemConverter {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public ActionItemDTO toDTO(ActionItem entity) {
        ActionItemDTO dto = new ActionItemDTO();
        dto.setId(entity.getId());
        dto.setDueDate(entity.getDueDate());
        dto.setContent(entity.getContent());
        dto.setCreatedAt(entity.getCreatedAt());

        try {
            UserDTO assignee = objectMapper.readValue(entity.getAssigneeJson(), UserDTO.class);
            dto.setAssignee(assignee);
        } catch (Exception e) {
            // 处理异常
        }

        return dto;
    }

    public ActionItem toEntity(ActionItemDTO dto) {
        ActionItem entity = new ActionItem();
        entity.setId(dto.getId());
        entity.setDueDate(dto.getDueDate());
        entity.setContent(dto.getContent());
        entity.setCreatedAt(dto.getCreatedAt());

        try {
            String assigneeJson = objectMapper.writeValueAsString(dto.getAssignee());
            entity.setAssigneeJson(assigneeJson);
        } catch (Exception e) {
            // 处理异常
        }

        return entity;
    }

    public List<ActionItemDTO> toDTOList(List<ActionItem> entities) {
        return entities.stream().map(this::toDTO).collect(Collectors.toList());
    }
}