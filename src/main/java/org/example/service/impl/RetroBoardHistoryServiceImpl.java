package org.example.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.example.entity.RetroBoardHistory;
import org.example.mapper.RetroBoardHistoryMapper;
import org.example.service.RetroBoardHistoryService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RetroBoardHistoryServiceImpl extends ServiceImpl<RetroBoardHistoryMapper, RetroBoardHistory> implements RetroBoardHistoryService {

    @Override
    public List<RetroBoardHistory> getAllHistory() {
        return lambdaQuery()
                .orderByDesc(RetroBoardHistory::getDeletedAt)
                .list();
    }

    @Override
    public RetroBoardHistory getHistoryById(Long id) {
        return getById(id);
    }

    @Override
    public void deleteHistory(Long id) {
        removeById(id);
    }

    @Override
    public void saveHistory(String cardsJson, String deletedByUserId, String deletedByUsername) {
        RetroBoardHistory history = new RetroBoardHistory();
        history.setCardsJson(cardsJson);
        history.setDeletedByUserId(deletedByUserId);
        history.setDeletedByUsername(deletedByUsername);
        history.setDeletedAt(LocalDateTime.now());
        save(history);
    }
}