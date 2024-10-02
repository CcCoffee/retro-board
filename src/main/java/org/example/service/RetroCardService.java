package org.example.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.example.entity.RetroCard;
import org.springframework.stereotype.Service;

@Service
public interface RetroCardService extends IService<RetroCard>  {

    void clearAll();
}