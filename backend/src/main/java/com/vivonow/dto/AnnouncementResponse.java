package com.vivonow.dto;

import java.time.LocalDateTime;

public class AnnouncementResponse {
    private Long id;
    private String message;
    private String icon;
    private LocalDateTime createdAt;
    private String createdBy;

    public AnnouncementResponse() {
    }

    public AnnouncementResponse(Long id, String message, String icon, LocalDateTime createdAt, String createdBy) {
        this.id = id;
        this.message = message;
        this.icon = icon;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
}
