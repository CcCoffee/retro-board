package org.example.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.entity.RetroCard;
import org.example.mapper.RetroCardMapper;
import org.example.service.RetroCardService;
import org.example.service.RetroBoardHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RetroCardServiceImpl extends ServiceImpl<RetroCardMapper, RetroCard> implements RetroCardService {
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RetroBoardHistoryService retroBoardHistoryService;

    @Override
    @Transactional
    public void clearBoard(String deletedBy) {
        List<RetroCard> allCards = list();
        String cardsJson;
        try {
            cardsJson = objectMapper.writeValueAsString(allCards);
        } catch (Exception e) {
            throw new RuntimeException("Error converting cards to JSON", e);
        }

        retroBoardHistoryService.saveHistory(cardsJson, deletedBy);
        remove(null);
    }
}