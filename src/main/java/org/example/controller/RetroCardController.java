package org.example.controller;

import org.example.converter.RetroCardConverter;
import org.example.dto.RetroCardDTO;
import org.example.dto.UserDTO;
import org.example.entity.RetroCard;
import org.example.service.RetroCardService;
import org.example.util.LoginUserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/retro-cards")
public class RetroCardController {

    @Autowired
    private RetroCardService retroCardService;

    @Autowired
    private LoginUserUtil loginUserUtil;

    @Autowired
    private RetroCardConverter retroCardConverter;

    @PostMapping
    public RetroCardDTO create(@RequestBody RetroCardDTO retroCardDTO) {
        retroCardService.save(retroCardConverter.toEntity(retroCardDTO));
        return retroCardDTO;
    }

    @GetMapping("/{id}")
    public RetroCardDTO getById(@PathVariable Long id) {
        return retroCardConverter.toDTO(retroCardService.getById(id));
    }

    @GetMapping
    public List<RetroCardDTO> getAll() {
        return retroCardService.list().stream()
                .map(retroCardConverter::toDTO)
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}")
    public RetroCardDTO update(@PathVariable Long id, @RequestBody RetroCardDTO retroCardDTO) {
        retroCardDTO.setId(id);
        retroCardService.updateById(retroCardConverter.toEntity(retroCardDTO));
        return retroCardDTO;
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        retroCardService.removeById(id);
    }

    @PostMapping("/clear")
    public ResponseEntity<Void> clearBoard() {
        UserDTO currentUser = loginUserUtil.getCurrentUser();
        retroCardService.clearBoard(currentUser.getId(), currentUser.getName());
        return ResponseEntity.ok().build();
    }
}