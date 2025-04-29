package com.vivonow.dto;

public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String teamName;
    private boolean newTeam;

    public RegisterRequest() {
    }

    public RegisterRequest(String name, String email, String password, String teamName, boolean newTeam) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.teamName = teamName;
        this.newTeam = newTeam;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public boolean isNewTeam() {
        return newTeam;
    }

    public void setNewTeam(boolean newTeam) {
        this.newTeam = newTeam;
    }
}
