package com.vivonow.dto;

public class AnnouncementRequest {
    private String message;
    private String icon;

    public AnnouncementRequest() {
    }

    public AnnouncementRequest(String message, String icon) {
        this.message = message;
        this.icon = icon;
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
}
