package org.example.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.example.entity.ActionItem;

import java.util.List;

public interface ActionItemService extends IService<ActionItem> {
	
	List<ActionItem> listOrderByIdDesc();
}