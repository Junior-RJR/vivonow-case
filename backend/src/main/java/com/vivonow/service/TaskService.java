package com.vivonow.service;

import com.vivonow.model.Task;
import com.vivonow.model.TaskStatus;
import com.vivonow.model.Team;
import com.vivonow.model.User;
import com.vivonow.repository.TaskRepository;
import com.vivonow.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksByTeam(Team team) {
        return taskRepository.findByTeam(team);
    }

    public List<Task> getTasksByTeamAndStatus(Team team, TaskStatus status) {
        return taskRepository.findByTeamAndStatus(team, status);
    }

    public List<Task> getTasksByAssignee(User assignee) {
        return taskRepository.findByAssignee(assignee);
    }

    public List<Task> getTasksByTeamAndAssignee(Team team, User assignee) {
        return taskRepository.findByTeamAndAssignee(team, assignee);
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public Task createTask(String title, String description, LocalDate dueDate, TaskStatus status, Long assigneeId, Team team) {
        User assignee = userRepository.findById(assigneeId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!assignee.getTeam().equals(team)) {
            throw new RuntimeException("O responsável deve pertencer à mesma equipe da tarefa");
        }

        Task task = new Task(title, description, dueDate, status, assignee, team);
        return taskRepository.save(task);
    }

    public Task updateTask(Long id, String title, String description, LocalDate dueDate, TaskStatus status, Long assigneeId) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

        User assignee = userRepository.findById(assigneeId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!assignee.getTeam().equals(task.getTeam())) {
            throw new RuntimeException("O responsável deve pertencer à mesma equipe da tarefa");
        }

        task.setTitle(title);
        task.setDescription(description);
        task.setDueDate(dueDate);
        task.setStatus(status);
        task.setAssignee(assignee);

        return taskRepository.save(task);
    }

    public Task updateTaskStatus(Long id, TaskStatus status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

        task.setStatus(status);
        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}
