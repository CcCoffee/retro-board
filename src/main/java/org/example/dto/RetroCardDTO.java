package org.example.dto;

import java.time.LocalDateTime;
import java.util.List;

public class RetroCardDTO {
    private Long id;
    private String type;
    private String content;
    private boolean isAnonymous;
    private List<UserDTO> likes; // 修改这里
    private LocalDateTime createdAt;
    private UserDTO author;

    // 构造函数
    public RetroCardDTO() {}

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public boolean isAnonymous() {
        return isAnonymous;
    }

    public void setAnonymous(boolean anonymous) {
        isAnonymous = anonymous;
    }

    public List<UserDTO> getLikes() { // 修改这里
        return likes;
    }

    public void setLikes(List<UserDTO> likes) { // 修改这里
        this.likes = likes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public UserDTO getAuthor() {
        return author;
    }

    public void setAuthor(UserDTO author) {
        this.author = author;
    }
}