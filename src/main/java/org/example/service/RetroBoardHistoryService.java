package org.example.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.example.entity.RetroBoardHistory;

import java.util.List;

public interface RetroBoardHistoryService extends IService<RetroBoardHistory> {
    List<RetroBoardHistory> getAllHistory();
    RetroBoardHistory getHistoryById(Long id);
    void deleteHistory(Long id);
    void saveHistory(String cardsJson, String deletedByUserId, String deletedByUsername);
}