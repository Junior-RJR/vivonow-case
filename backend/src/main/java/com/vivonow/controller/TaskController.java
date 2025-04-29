package com.vivonow.controller;

import com.vivonow.dto.TaskRequest;
import com.vivonow.dto.TaskResponse;
import com.vivonow.dto.TaskStatusRequest;
import com.vivonow.model.Task;
import com.vivonow.model.TaskStatus;
import com.vivonow.model.User;
import com.vivonow.service.TaskService;
import com.vivonow.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/tasks")
@Tag(name = "Tarefas", description = "Endpoints para gerenciamento de tarefas")
@SecurityRequirement(name = "bearer-jwt")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    private static final Logger logger = LoggerFactory.getLogger(TaskController.class);
    private final TaskService taskService;
    private final UserService userService;

    public TaskController(TaskService taskService, UserService userService) {
        this.taskService = taskService;
        this.userService = userService;
    }

    @GetMapping
    @Operation(summary = "Listar tarefas da equipe", description = "Retorna todas as tarefas da equipe do usuário autenticado")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de tarefas recuperada com sucesso", 
                     content = @Content(array = @ArraySchema(schema = @Schema(implementation = TaskResponse.class))))
    })
    public ResponseEntity<List<TaskResponse>> getTasksByTeam(@AuthenticationPrincipal User user) {
        try {
            logger.info("Buscando tarefas para a equipe: {}", user.getTeam().getName());
            List<Task> tasks = taskService.getTasksByTeam(user.getTeam());
            List<TaskResponse> taskResponses = tasks.stream()
                    .map(this::mapToTaskResponse)
                    .collect(Collectors.toList());
            logger.info("Encontradas {} tarefas", tasks.size());
            return ResponseEntity.ok(taskResponses);
        } catch (Exception e) {
            logger.error("Erro ao buscar tarefas: {}", e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Listar tarefas por status", description = "Retorna todas as tarefas da equipe com o status especificado")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de tarefas recuperada com sucesso", 
                     content = @Content(array = @ArraySchema(schema = @Schema(implementation = TaskResponse.class))))
    })
    public ResponseEntity<List<TaskResponse>> getTasksByStatus(
            @AuthenticationPrincipal User user,
            @Parameter(description = "Status da tarefa") @PathVariable TaskStatus status) {
        List<Task> tasks = taskService.getTasksByTeamAndStatus(user.getTeam(), status);
        List<TaskResponse> taskResponses = tasks.stream()
                .map(this::mapToTaskResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(taskResponses);
    }

    @GetMapping("/assignee/{assigneeId}")
    @Operation(summary = "Listar tarefas por responsável", description = "Retorna todas as tarefas atribuídas ao responsável especificado")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de tarefas recuperada com sucesso", 
                     content = @Content(array = @ArraySchema(schema = @Schema(implementation = TaskResponse.class)))),
        @ApiResponse(responseCode = "400", description = "Responsável não encontrado ou não pertence à mesma equipe")
    })
    public ResponseEntity<List<TaskResponse>> getTasksByAssignee(
            @AuthenticationPrincipal User user,
            @Parameter(description = "ID do responsável") @PathVariable Long assigneeId) {
        User assignee = userService.getUserById(assigneeId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        if (!assignee.getTeam().equals(user.getTeam())) {
            return ResponseEntity.badRequest().build();
        }
        
        List<Task> tasks = taskService.getTasksByTeamAndAssignee(user.getTeam(), assignee);
        List<TaskResponse> taskResponses = tasks.stream()
                .map(this::mapToTaskResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(taskResponses);
    }

    @PostMapping
    @Operation(summary = "Criar tarefa", description = "Cria uma nova tarefa para a equipe do usuário autenticado")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Tarefa criada com sucesso", 
                     content = @Content(schema = @Schema(implementation = TaskResponse.class))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    public ResponseEntity<TaskResponse> createTask(
            @AuthenticationPrincipal User user,
            @RequestBody TaskRequest request) {
        Task task = taskService.createTask(
                request.getTitle(),
                request.getDescription(),
                request.getDueDate(),
                request.getStatus(),
                request.getAssigneeId(),
                user.getTeam()
        );
        return ResponseEntity.ok(mapToTaskResponse(task));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar tarefa", description = "Atualiza uma tarefa existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Tarefa atualizada com sucesso", 
                     content = @Content(schema = @Schema(implementation = TaskResponse.class))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos ou tarefa não pertence à equipe do usuário"),
        @ApiResponse(responseCode = "404", description = "Tarefa não encontrada")
    })
    public ResponseEntity<TaskResponse> updateTask(
            @AuthenticationPrincipal User user,
            @Parameter(description = "ID da tarefa") @PathVariable Long id,
            @RequestBody TaskRequest request) {
        Task task = taskService.getTaskById(id)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));
        
        if (!task.getTeam().equals(user.getTeam())) {
            return ResponseEntity.badRequest().build();
        }
        
        Task updatedTask = taskService.updateTask(
                id,
                request.getTitle(),
                request.getDescription(),
                request.getDueDate(),
                request.getStatus(),
                request.getAssigneeId()
        );
        return ResponseEntity.ok(mapToTaskResponse(updatedTask));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Atualizar status da tarefa", description = "Atualiza apenas o status de uma tarefa existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Status da tarefa atualizado com sucesso", 
                     content = @Content(schema = @Schema(implementation = TaskResponse.class))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos ou tarefa não pertence à equipe do usuário"),
        @ApiResponse(responseCode = "404", description = "Tarefa não encontrada")
    })
    public ResponseEntity<TaskResponse> updateTaskStatus(
            @AuthenticationPrincipal User user,
            @Parameter(description = "ID da tarefa") @PathVariable Long id,
            @RequestBody TaskStatusRequest request) {
        Task task = taskService.getTaskById(id)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));
        
        if (!task.getTeam().equals(user.getTeam())) {
            return ResponseEntity.badRequest().build();
        }
        
        Task updatedTask = taskService.updateTaskStatus(id, request.getStatus());
        return ResponseEntity.ok(mapToTaskResponse(updatedTask));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir tarefa", description = "Exclui uma tarefa existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Tarefa excluída com sucesso"),
        @ApiResponse(responseCode = "400", description = "Tarefa não pertence à equipe do usuário"),
        @ApiResponse(responseCode = "404", description = "Tarefa não encontrada")
    })
    public ResponseEntity<Void> deleteTask(
            @AuthenticationPrincipal User user,
            @Parameter(description = "ID da tarefa") @PathVariable Long id) {
        Task task = taskService.getTaskById(id)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));
        
        if (!task.getTeam().equals(user.getTeam())) {
            return ResponseEntity.badRequest().build();
        }
        
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    private TaskResponse mapToTaskResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.getStatus(),
                task.getAssignee().getId(),
                task.getAssignee().getName(),
                task.getTeam().getId(),
                task.getTeam().getName()
        );
    }
}
