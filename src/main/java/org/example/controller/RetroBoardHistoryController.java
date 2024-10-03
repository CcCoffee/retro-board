package org.example.controller;

import org.example.converter.RetroBoardHistoryConverter;
import org.example.dto.RetroBoardHistoryDTO;
import org.example.entity.RetroBoardHistory;
import org.example.service.RetroBoardHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/history")
public class RetroBoardHistoryController {

    @Autowired
    private RetroBoardHistoryService retroBoardHistoryService;

    @GetMapping
    public ResponseEntity<List<RetroBoardHistoryDTO>> getAllHistory() {
        List<RetroBoardHistory> histories = retroBoardHistoryService.getAllHistory();
        List<RetroBoardHistoryDTO> dtos = histories.stream()
                .map(RetroBoardHistoryConverter::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RetroBoardHistoryDTO> getHistoryById(@PathVariable Long id) {
        RetroBoardHistory history = retroBoardHistoryService.getHistoryById(id);
        if (history == null) {
            return ResponseEntity.notFound().build();
        }
        RetroBoardHistoryDTO dto = RetroBoardHistoryConverter.toDTO(history);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHistory(@PathVariable Long id) {
        retroBoardHistoryService.deleteHistory(id);
        return ResponseEntity.ok().build();
    }
}