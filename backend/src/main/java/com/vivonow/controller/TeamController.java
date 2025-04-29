package com.vivonow.controller;

import com.vivonow.model.Role;
import com.vivonow.model.Team;
import com.vivonow.model.User;
import com.vivonow.service.TeamService;
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
@RequestMapping("/api/teams")
@Tag(name = "Equipes", description = "Endpoints para gerenciamento de equipes")
@SecurityRequirement(name = "bearer-jwt")
@CrossOrigin(origins = "http://localhost:3000")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping
    @Operation(summary = "Listar equipes", description = "Retorna todas as equipes do sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de equipes recuperada com sucesso", 
                     content = @Content(array = @ArraySchema(schema = @Schema(implementation = Team.class))))
    })
    public ResponseEntity<List<Team>> getAllTeams() {
        List<Team> teams = teamService.getAllTeams();
        return ResponseEntity.ok(teams);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obter equipe por ID", description = "Retorna uma equipe específica pelo ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Equipe encontrada", 
                     content = @Content(schema = @Schema(implementation = Team.class))),
        @ApiResponse(responseCode = "404", description = "Equipe não encontrada")
    })
    public ResponseEntity<Team> getTeamById(
            @Parameter(description = "ID da equipe") @PathVariable Long id) {
        return teamService.getTeamById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Criar equipe", description = "Cria uma nova equipe (apenas para administradores)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Equipe criada com sucesso", 
                     content = @Content(schema = @Schema(implementation = Team.class))),
        @ApiResponse(responseCode = "400", description = "Nome de equipe já existe"),
        @ApiResponse(responseCode = "403", description = "Acesso negado - apenas administradores podem criar equipes")
    })
    public ResponseEntity<Team> createTeam(
            @AuthenticationPrincipal User user,
            @Parameter(description = "Nome da equipe") @RequestParam String name) {
        if (user.getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).build();
        }
        
        Team team = teamService.createTeam(name);
        return ResponseEntity.ok(team);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir equipe", description = "Exclui uma equipe existente (apenas para administradores)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Equipe excluída com sucesso"),
        @ApiResponse(responseCode = "403", description = "Acesso negado - apenas administradores podem excluir equipes"),
        @ApiResponse(responseCode = "404", description = "Equipe não encontrada")
    })
    public ResponseEntity<Void> deleteTeam(
            @AuthenticationPrincipal User user,
            @Parameter(description = "ID da equipe") @PathVariable Long id) {
        if (user.getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).build();
        }
        
        teamService.deleteTeam(id);
        return ResponseEntity.noContent().build();
    }
}
