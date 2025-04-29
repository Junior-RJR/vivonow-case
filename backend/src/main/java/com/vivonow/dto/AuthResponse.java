package com.vivonow.dto;

public class AuthResponse {
    private String token;
    private String name;
    private String email;
    private String role;
    private String team;

    public AuthResponse() {
    }

    public AuthResponse(String token, String name, String email, String role, String team) {
        this.token = token;
        this.name = name;
        this.email = email;
        this.role = role;
        this.team = team;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getTeam() {
        return team;
    }

    public void setTeam(String team) {
        this.team = team;
    }
}
