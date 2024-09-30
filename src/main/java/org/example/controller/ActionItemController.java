package org.example.controller;

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

    @PostMapping
    public ActionItem create(@RequestBody ActionItem actionItem) {
        actionItemService.save(actionItem);
        return actionItem;
    }

    @GetMapping("/{id}")
    public ActionItem getById(@PathVariable Long id) {
        return actionItemService.getById(id);
    }

    @GetMapping
    public List<ActionItem> getAll() {
        return actionItemService.list();
    }

    @PutMapping("/{id}")
    public ActionItem update(@PathVariable Long id, @RequestBody ActionItem actionItem) {
        actionItem.setId(id);
        actionItemService.updateById(actionItem);
        return actionItem;
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        actionItemService.removeById(id);
    }
}