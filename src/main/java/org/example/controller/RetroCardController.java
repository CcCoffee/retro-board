package org.example.controller;

import org.example.entity.RetroCard;
import org.example.service.RetroCardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/retro-cards")
public class RetroCardController {

    @Autowired
    private RetroCardService retroCardService;

    @PostMapping
    public RetroCard create(@RequestBody RetroCard retroCard) {
        retroCardService.save(retroCard);
        return retroCard;
    }

    @GetMapping("/{id}")
    public RetroCard getById(@PathVariable Long id) {
        return retroCardService.getById(id);
    }

    @GetMapping
    public List<RetroCard> getAll() {
        return retroCardService.list();
    }

    @PutMapping("/{id}")
    public RetroCard update(@PathVariable Long id, @RequestBody RetroCard retroCard) {
        retroCard.setId(id);
        retroCardService.updateById(retroCard);
        return retroCard;
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        retroCardService.removeById(id);
    }
}