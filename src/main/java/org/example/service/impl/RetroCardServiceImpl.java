package org.example.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.example.converter.RetroCardConverter;
import org.example.dto.RetroCardDTO;
import org.example.dto.UserDTO;
import org.example.entity.RetroBoardHistory;
import org.example.entity.RetroCard;
import org.example.mapper.RetroCardMapper;
import org.example.service.RetroBoardHistoryService;
import org.example.service.RetroCardService;
import org.example.util.JsonUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RetroCardServiceImpl extends ServiceImpl<RetroCardMapper, RetroCard> implements RetroCardService {

    private final RetroCardMapper retroCardMapper;
    private final RetroCardConverter retroCardConverter;
    @Autowired
    private RetroBoardHistoryService retroBoardHistoryService;
    @Autowired
    private JsonUtil jsonUtil;

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

    @Override
    @Transactional
    public void clearBoard(UserDTO deletedBy) {
        List<RetroCard> allCards = list();

        String cardsJson = jsonUtil.convertObjectToJson(allCards);
        String deletedByJson = jsonUtil.convertObjectToJson(deletedBy);
        RetroBoardHistory retroBoardHistory = new RetroBoardHistory();
        retroBoardHistory.setCardsJson(cardsJson);
        retroBoardHistory.setDeletedBy(deletedByJson);
        retroBoardHistory.setDeletedAt(LocalDateTime.now());
        retroBoardHistoryService.save(retroBoardHistory);
        remove(null);
    }
}