package org.example.dto;

import org.example.entity.RetroCard;

import java.time.LocalDateTime;
import java.util.List;

public class RetroBoardHistoryDTO {
    private Long id;
    private List<RetroCard> cards;
    private String deletedBy;
    private LocalDateTime deletedAt;

    // Constructors
    public RetroBoardHistoryDTO() {}

    public RetroBoardHistoryDTO(Long id, List<RetroCard> cards, String deletedBy, LocalDateTime deletedAt) {
        this.id = id;
        this.cards = cards;
        this.deletedBy = deletedBy;
        this.deletedAt = deletedAt;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<RetroCard> getCards() {
        return cards;
    }

    public void setCards(List<RetroCard> cards) {
        this.cards = cards;
    }

    public String getDeletedBy() {
        return deletedBy;
    }

    public void setDeletedBy(String deletedBy) {
        this.deletedBy = deletedBy;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }
}