package com.vivonow.dto;

import com.vivonow.model.Role;

public class UserUpdateRequest {
    private String name;
    private String email;
    private Long teamId;
    private Role role;

    public UserUpdateRequest() {
    }

    public UserUpdateRequest(String name, String email, Long teamId, Role role) {
        this.name = name;
        this.email = email;
        this.teamId = teamId;
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
