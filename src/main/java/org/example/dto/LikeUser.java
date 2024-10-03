package org.example.dto;

public class LikeUser {
    private String userId;
    private String username;

    // 构造函数
    public LikeUser(String userId, String username) {
        this.userId = userId;
        this.username = username;
    }

    // Getter和Setter方法
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}