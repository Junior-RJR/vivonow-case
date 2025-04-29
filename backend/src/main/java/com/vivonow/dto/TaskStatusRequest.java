package com.vivonow.dto;

import com.vivonow.model.TaskStatus;

public class TaskStatusRequest {
    private TaskStatus status;

    public TaskStatusRequest() {
    }

    public TaskStatusRequest(TaskStatus status) {
        this.status = status;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }
}
