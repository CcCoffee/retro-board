package org.example.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.example.entity.RetroCard;

public interface RetroCardService extends IService<RetroCard> {
    void clearBoard(String deletedBy);
}