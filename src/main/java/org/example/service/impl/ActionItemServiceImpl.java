package org.example.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.example.entity.ActionItem;
import org.example.mapper.ActionItemMapper;
import org.example.service.ActionItemService;
import org.springframework.stereotype.Service;

@Service
public class ActionItemServiceImpl extends ServiceImpl<ActionItemMapper, ActionItem> implements ActionItemService {
}