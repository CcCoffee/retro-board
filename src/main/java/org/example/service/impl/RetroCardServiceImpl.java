package org.example.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.converter.RetroCardConverter;
import org.example.dto.RetroCardDTO;
import org.example.entity.RetroCard;
import org.example.mapper.RetroCardMapper;
import org.example.service.RetroCardService;
import org.example.service.RetroBoardHistoryService;
import org.example.util.JsonUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RetroCardServiceImpl extends ServiceImpl<RetroCardMapper, RetroCard> implements RetroCardService {

    @Autowired
    private RetroBoardHistoryService retroBoardHistoryService;
    @Autowired
    private RetroCardConverter retroCardConverter;
    @Autowired
    private JsonUtil jsonUtil;

    @Override
    @Transactional
    public void clearBoard(String deletedByUserId, String deletedByUsername) {
        List<RetroCard> allCards = list();
        List<RetroCardDTO> allCardDTOs = allCards.stream()
                .map(retroCardConverter::toDTO)
                .collect(Collectors.toList());
        
        String cardsJson = jsonUtil.convertCardsToJson(allCardDTOs);
        retroBoardHistoryService.saveHistory(cardsJson, deletedByUserId, deletedByUsername);
        remove(null);
    }
}