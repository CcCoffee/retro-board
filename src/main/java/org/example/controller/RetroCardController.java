package org.example.controller;

import org.example.dto.RetroCardDTO;
import org.example.dto.UserDTO;
import org.example.service.RetroCardService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/retro-cards")
public class RetroCardController {

    private final RetroCardService retroCardService;

    public RetroCardController(RetroCardService retroCardService) {
        this.retroCardService = retroCardService;
    }

    @PostMapping
    public RetroCardDTO createRetroCard(@RequestBody RetroCardDTO retroCardDTO) {
        return retroCardService.createRetroCard(retroCardDTO);
    }

    @GetMapping("/{id}")
    public RetroCardDTO getRetroCardById(@PathVariable Long id) {
        return retroCardService.getRetroCardById(id);
    }

    @GetMapping
    public List<RetroCardDTO> getAllRetroCards() {
        return retroCardService.getAllRetroCards();
    }

    @PutMapping("/{id}")
    public RetroCardDTO updateRetroCard(@PathVariable Long id, @RequestBody RetroCardDTO retroCardDTO) {
        return retroCardService.updateRetroCard(id, retroCardDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteRetroCard(@PathVariable Long id) {
        retroCardService.deleteRetroCard(id);
    }

    @PostMapping("/{id}/like")
    public RetroCardDTO likeRetroCard(@PathVariable Long id, @RequestBody UserDTO user) {
        return retroCardService.likeRetroCard(id, user);
    }
}