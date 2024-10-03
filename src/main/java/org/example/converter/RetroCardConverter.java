package org.example.converter;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.dto.RetroCardDTO;
import org.example.dto.UserDTO;
import org.example.entity.RetroCard;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class RetroCardConverter {

	private final ObjectMapper objectMapper = new ObjectMapper();

	public RetroCardDTO toDTO(RetroCard entity) {
		RetroCardDTO dto = new RetroCardDTO();
		dto.setId(entity.getId());
		dto.setType(entity.getType());
		dto.setContent(entity.getContent());
		dto.setAnonymous(entity.isAnonymous());
		dto.setCreatedAt(entity.getCreatedAt());

		try {
			// 检查 authorJson 是否为空
			if (entity.getAuthorJson() != null && !entity.getAuthorJson().isEmpty()) {
				UserDTO author = objectMapper.readValue(entity.getAuthorJson(), UserDTO.class);
				dto.setAuthor(author);
			}

			// 检查 likesJson 是否为空
			if (entity.getLikesJson() != null && !entity.getLikesJson().isEmpty()) {
				List<UserDTO> likes = objectMapper.readValue(entity.getLikesJson(), 
					objectMapper.getTypeFactory().constructCollectionType(List.class, UserDTO.class));
				dto.setLikes(likes);
			}
		} catch (Exception e) {
			// 记录异常，但不抛出
			e.printStackTrace();
		}

		return dto;
	}

	public RetroCard toEntity(RetroCardDTO dto) {
		RetroCard entity = new RetroCard();
		entity.setId(dto.getId());
		entity.setType(dto.getType());
		entity.setContent(dto.getContent());
		entity.setAnonymous(dto.isAnonymous());
		entity.setCreatedAt(dto.getCreatedAt());

		try {
			String authorJson = objectMapper.writeValueAsString(dto.getAuthor());
			entity.setAuthorJson(authorJson);
			String likesJson = objectMapper.writeValueAsString(dto.getLikes());
			entity.setLikesJson(likesJson);
		} catch (Exception e) {
			// 处理异常
		}

		return entity;
	}

	public List<RetroCardDTO> toDTOList(List<RetroCard> entities) {
		return entities.stream().map(this::toDTO).collect(Collectors.toList());
	}
}