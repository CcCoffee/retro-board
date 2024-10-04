package org.example.controller;

import org.example.converter.ActionItemConverter;
import org.example.dto.ActionItemDTO;
import org.example.entity.ActionItem;
import org.example.service.ActionItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/action-items")
public class ActionItemController {

    @Autowired
    private ActionItemService actionItemService;

    @Autowired
    private ActionItemConverter actionItemConverter;

    @PostMapping
    public ActionItemDTO create(@RequestBody ActionItemDTO actionItemDTO) {
        ActionItem actionItem = actionItemConverter.toEntity(actionItemDTO);
        actionItemService.save(actionItem);
        return actionItemConverter.toDTO(actionItem);
    }

    @GetMapping("/{id}")
    public ActionItemDTO getById(@PathVariable Long id) {
        ActionItem actionItem = actionItemService.getById(id);
        return actionItemConverter.toDTO(actionItem);
    }

    @GetMapping
    public List<ActionItemDTO> getAll() {
        List<ActionItem> actionItems = actionItemService.listOrderByIdDesc();
        return actionItemConverter.toDTOList(actionItems);
    }

    @PutMapping("/{id}")
    public ActionItemDTO update(@PathVariable Long id, @RequestBody ActionItemDTO actionItemDTO) {
        ActionItem actionItem = actionItemConverter.toEntity(actionItemDTO);
        actionItem.setId(id);
        actionItemService.updateById(actionItem);
        return actionItemConverter.toDTO(actionItem);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        actionItemService.removeById(id);
    }
}