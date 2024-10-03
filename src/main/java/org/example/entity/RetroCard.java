package org.example.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import java.time.LocalDateTime;

@TableName("retro_card")
public class RetroCard {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String type;
    private String content;
    private Boolean isAnonymous;
    private String authorJson;
    private String likesJson;
    private LocalDateTime createdAt;

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

    public String getAuthorJson() {
        return authorJson;
    }

    public void setAuthorJson(String authorJson) {
        this.authorJson = authorJson;
    }

    public String getLikesJson() {
        return likesJson;
    }

    public void setLikesJson(String likesJson) {
        this.likesJson = likesJson;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}