package org.example.dto;

import java.time.LocalDateTime;
import java.util.List;

public class RetroBoardHistoryDTO {
    private Long id;
    private List<RetroCardDTO> cards; // 修改为使用 RetroCardDTO
    private String deletedByUserId;
    private String deletedByUsername;
    private LocalDateTime deletedAt;

    // Constructors
    public RetroBoardHistoryDTO() {}

    public RetroBoardHistoryDTO(Long id, List<RetroCardDTO> cards, String deletedByUserId, String deletedByUsername, LocalDateTime deletedAt) {
        this.id = id;
        this.cards = cards; // 修改为使用 RetroCardDTO
        this.deletedByUserId = deletedByUserId;
        this.deletedByUsername = deletedByUsername;
        this.deletedAt = deletedAt;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<RetroCardDTO> getCards() {
        return cards;
    }

    public void setCards(List<RetroCardDTO> cards) {
        this.cards = cards;
    }

    public String getDeletedByUserId() {
        return deletedByUserId;
    }

    public void setDeletedByUserId(String deletedByUserId) {
        this.deletedByUserId = deletedByUserId;
    }

    public String getDeletedByUsername() {
        return deletedByUsername;
    }

    public void setDeletedByUsername(String deletedByUsername) {
        this.deletedByUsername = deletedByUsername;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }
}