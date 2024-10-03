package org.example.service.impl;

import org.example.converter.RetroCardConverter;
import org.example.dto.RetroCardDTO;
import org.example.dto.UserDTO;
import org.example.entity.RetroCard;
import org.example.mapper.RetroCardMapper;
import org.example.service.RetroCardService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RetroCardServiceImpl implements RetroCardService {

    private final RetroCardMapper retroCardMapper;
    private final RetroCardConverter retroCardConverter;

    public RetroCardServiceImpl(RetroCardMapper retroCardMapper, RetroCardConverter retroCardConverter) {
        this.retroCardMapper = retroCardMapper;
        this.retroCardConverter = retroCardConverter;
    }

    @Override
    public RetroCardDTO createRetroCard(RetroCardDTO retroCardDTO) {
        RetroCard retroCard = retroCardConverter.toEntity(retroCardDTO);
        retroCardMapper.insert(retroCard);
        return retroCardConverter.toDTO(retroCard);
    }

    @Override
    public RetroCardDTO getRetroCardById(Long id) {
        RetroCard retroCard = retroCardMapper.selectById(id);
        return retroCardConverter.toDTO(retroCard);
    }

    @Override
    public List<RetroCardDTO> getAllRetroCards() {
        List<RetroCard> retroCards = retroCardMapper.selectList(null);
        return retroCardConverter.toDTOList(retroCards);
    }

    @Override
    public RetroCardDTO updateRetroCard(Long id, RetroCardDTO retroCardDTO) {
        RetroCard retroCard = retroCardConverter.toEntity(retroCardDTO);
        retroCard.setId(id);
        retroCardMapper.updateById(retroCard);
        return retroCardConverter.toDTO(retroCard);
    }

    @Override
    public void deleteRetroCard(Long id) {
        retroCardMapper.deleteById(id);
    }

    @Override
    public RetroCardDTO likeRetroCard(Long id, UserDTO user) {
        RetroCard retroCard = retroCardMapper.selectById(id);
        RetroCardDTO retroCardDTO = retroCardConverter.toDTO(retroCard);
        List<UserDTO> likes = retroCardDTO.getLikes();
        likes.add(user);
        retroCard = retroCardConverter.toEntity(retroCardDTO);
        retroCardMapper.updateById(retroCard);
        return retroCardConverter.toDTO(retroCard);
    }
}