package org.example.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.example.entity.RetroBoardHistory;
import org.example.mapper.RetroBoardHistoryMapper;
import org.example.service.RetroBoardHistoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RetroBoardHistoryServiceImpl extends ServiceImpl<RetroBoardHistoryMapper, RetroBoardHistory> implements RetroBoardHistoryService {

    @Override
    public List<RetroBoardHistory> getAllHistory() {
        return lambdaQuery()
                .orderByDesc(RetroBoardHistory::getDeletedAt)
                .last("LIMIT 20")  // 添加这一行来限制结果数量
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
}