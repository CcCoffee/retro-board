package org.example.controller;

import org.example.entity.RetroBoardHistory;
import org.example.service.RetroBoardHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
public class RetroBoardHistoryController {

    @Autowired
    private RetroBoardHistoryService retroBoardHistoryService;

    @GetMapping
    public ResponseEntity<List<RetroBoardHistory>> getAllHistory() {
        return ResponseEntity.ok(retroBoardHistoryService.getAllHistory());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RetroBoardHistory> getHistoryById(@PathVariable Long id) {
        RetroBoardHistory history = retroBoardHistoryService.getHistoryById(id);
        if (history == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(history);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHistory(@PathVariable Long id) {
        retroBoardHistoryService.deleteHistory(id);
        return ResponseEntity.ok().build();
    }
}