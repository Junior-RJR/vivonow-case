package com.vivonow.controller;

import com.vivonow.dto.AnnouncementRequest;
import com.vivonow.dto.AnnouncementResponse;
import com.vivonow.model.Announcement;
import com.vivonow.model.Role;
import com.vivonow.model.User;
import com.vivonow.service.AnnouncementService;
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
@RequestMapping("/api/announcements")
@Tag(name = "Avisos", description = "Endpoints para gerenciamento de avisos")
@SecurityRequirement(name = "bearer-jwt")
@CrossOrigin(origins = "http://localhost:3000")
public class AnnouncementController {

    private static final Logger logger = LoggerFactory.getLogger(AnnouncementController.class);
    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @GetMapping
    @Operation(summary = "Listar avisos", description = "Retorna todos os avisos do sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de avisos recuperada com sucesso", 
                     content = @Content(array = @ArraySchema(schema = @Schema(implementation = AnnouncementResponse.class))))
    })
    public ResponseEntity<List<AnnouncementResponse>> getAllAnnouncements() {
        try {
            logger.info("Buscando todos os anúncios");
            List<Announcement> announcements = announcementService.getAllAnnouncements();
            List<AnnouncementResponse> responses = announcements.stream()
                    .map(this::mapToAnnouncementResponse)
                    .collect(Collectors.toList());
            logger.info("Encontrados {} anúncios", announcements.size());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            logger.error("Erro ao buscar anúncios: {}", e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping
    @Operation(summary = "Criar aviso", description = "Cria um novo aviso (apenas para administradores)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Aviso criado com sucesso", 
                     content = @Content(schema = @Schema(implementation = AnnouncementResponse.class))),
        @ApiResponse(responseCode = "403", description = "Acesso negado - apenas administradores podem criar avisos")
    })
    public ResponseEntity<AnnouncementResponse> createAnnouncement(
            @AuthenticationPrincipal User user,
            @RequestBody AnnouncementRequest request) {
        if (user.getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).build();
        }
        
        Announcement announcement = announcementService.createAnnouncement(
                request.getMessage(),
                request.getIcon(),
                user
        );
        return ResponseEntity.ok(mapToAnnouncementResponse(announcement));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir aviso", description = "Exclui um aviso existente (apenas para administradores)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Aviso excluído com sucesso"),
        @ApiResponse(responseCode = "403", description = "Acesso negado - apenas administradores podem excluir avisos"),
        @ApiResponse(responseCode = "404", description = "Aviso não encontrado")
    })
    public ResponseEntity<Void> deleteAnnouncement(
            @AuthenticationPrincipal User user,
            @Parameter(description = "ID do aviso") @PathVariable Long id) {
        if (user.getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).build();
        }
        
        announcementService.deleteAnnouncement(id);
        return ResponseEntity.noContent().build();
    }

    private AnnouncementResponse mapToAnnouncementResponse(Announcement announcement) {
        return new AnnouncementResponse(
                announcement.getId(),
                announcement.getMessage(),
                announcement.getIcon(),
                announcement.getCreatedAt(),
                announcement.getCreatedBy().getName()
        );
    }
}
