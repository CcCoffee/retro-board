package org.example.dto;

import java.time.LocalDateTime;
import java.util.List;

public class RetroBoardHistoryDTO {
    private Long id;
    private List<RetroCardDTO> cards; // 修改为使用 RetroCardDTO
    private UserDTO deletedBy;
    private LocalDateTime deletedAt;

    // 构造函数
    public RetroBoardHistoryDTO() {}

    public RetroBoardHistoryDTO(Long id, List<RetroCardDTO> cards, UserDTO deletedBy, LocalDateTime deletedAt) {
        this.id = id;
        this.cards = cards; // 修改为使用 RetroCardDTO
        this.deletedBy = deletedBy;
        this.deletedAt = deletedAt;
    }

    public UserDTO getDeletedBy() {
        return deletedBy;
    }

    public void setDeletedBy(UserDTO deletedBy) {
        this.deletedBy = deletedBy;
    }

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

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }
}