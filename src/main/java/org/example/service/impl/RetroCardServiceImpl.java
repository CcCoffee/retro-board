package org.example.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.example.entity.RetroCard;
import org.example.mapper.RetroCardMapper;
import org.example.service.RetroCardService;
import org.springframework.stereotype.Service;

@Service
public class RetroCardServiceImpl extends ServiceImpl<RetroCardMapper, RetroCard> implements RetroCardService {
}