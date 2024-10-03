package org.example.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.*;
import org.example.entity.RetroCard;
import org.example.entity.RetroBoardHistory;

import java.util.List;

@Mapper
public interface RetroCardMapper extends BaseMapper<RetroCard> {
}