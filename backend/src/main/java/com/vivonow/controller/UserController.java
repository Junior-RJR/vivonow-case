package com.vivonow.controller;

import com.vivonow.model.Role;
import com.vivonow.model.Team;
import com.vivonow.model.User;
import com.vivonow.service.TeamService;
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

@RestController
@RequestMapping("/api/users")
@Tag(name = "Usuários", description = "Endpoints para gerenciamento de usuários")
@SecurityRequirement(name = "bearer-jwt")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;
    private final TeamService teamService;

    public UserController(UserService userService, TeamService teamService) {
        this.userService = userService;
        this.teamService = teamService;
    }

    @GetMapping
    @Operation(summary = "Listar usuários", description = "Retorna todos os usuários do sistema (apenas para administradores)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de usuários recuperada com sucesso", 
                     content = @Content(array = @ArraySchema(schema = @Schema(implementation = User.class)))),
        @ApiResponse(responseCode = "403", description = "Acesso negado - apenas administradores podem listar todos os usuários")
    })
    public ResponseEntity<List<User>> getAllUsers(@AuthenticationPrincipal User user) {
        if (user.getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).build();
        }
        
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/team")
    @Operation(summary = "Listar usuários da equipe", description = "Retorna todos os usuários da equipe do usuário autenticado")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de usuários da equipe recuperada com sucesso", 
                     content = @Content(array = @ArraySchema(schema = @Schema(implementation = User.class))))
    })
    public ResponseEntity<List<User>> getUsersByTeam(@AuthenticationPrincipal User user) {
        List<User> users = userService.getUsersByTeam(user.getTeam());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obter usuário por ID", description = "Retorna um usuário específico pelo ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuário encontrado", 
                     content = @Content(schema = @Schema(implementation = User.class))),
        @ApiResponse(responseCode = "403", description = "Acesso negado - usuário não pertence à mesma equipe"),
        @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    })
    public ResponseEntity<?> getUserById(
            @AuthenticationPrincipal User currentUser,
            @Parameter(description = "ID do usuário") @PathVariable Long id) {
        return userService.getUserById(id)
                .map(user -> {
                    if (currentUser.getRole() == Role.ADMIN || user.getTeam().equals(currentUser.getTeam())) {
                        return ResponseEntity.ok(user);
                    } else {
                        return ResponseEntity.status(403).build();
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
